import dayjs from 'dayjs'
import { newId } from '../utils/id.js'
import { seedHalls, seedMachines } from '../seeds/seed.js'
import { clamp, drift, rand, randInt } from '../utils/random.js'
import { EventSchema, MachineSchema } from '../models/schemas.js'

class DataService {
  constructor() {
    this.halls = [...seedHalls]
    this.machines = new Map()
    this.events = []
    this.maxEvents = 1000
    this.metricsHistory = new Map() // machineId -> [{ts, metrics}]
    this.machineMicroStopUntil = new Map() // machineId -> timestamp(ms)
    this.hallShock = new Map()             // hallId -> { amp, decay, until }
    this.activeRuleAlarms = new Set()      // "RULE:machineId" -> aktiflik

    this.init()
  }

  init() {
    const now = dayjs().toISOString()
    for (const m of seedMachines) {
      const metrics = this._initialMetrics()
      const machine = {
        id: m.id,
        name: m.name,
        hallId: m.hallId,
        status: 'RUNNING',
        metrics,
        lastUpdateTs: now
      }
      MachineSchema.parse(machine)
      this.machines.set(m.id, machine)
      this.metricsHistory.set(m.id, this._genHistory(metrics))
    }
  }

  _initialMetrics() {
    return {
      oee: rand(70, 90),
      availability: rand(80, 98),
      performance: rand(75, 95),
      quality: rand(95, 100),
      throughputPerMin: rand(2, 10),
      cycleTimeSec: rand(5, 25),
      goodCount: randInt(1000, 3000),
      rejectCount: randInt(0, 50),
      temperature: rand(40, 70),
      pressure: rand(2, 6),
      vibration: rand(2, 12)
    }
  }

  _genHistory(seedMetrics) {
    const arr = []
    let cur = { ...seedMetrics }
    let t = dayjs().subtract(24, 'hour')
    for (let i = 0; i < 24 * 60; i++) {
      cur = {
        ...cur,
        oee: drift(cur.oee, 0.4, 40, 99),
        availability: drift(cur.availability, 0.3, 40, 100),
        performance: drift(cur.performance, 0.4, 40, 100),
        quality: drift(cur.quality, 0.2, 70, 100),
        throughputPerMin: drift(cur.throughputPerMin, 0.3, 0, 15),
        cycleTimeSec: clamp(60 / Math.max(cur.throughputPerMin, 0.1), 2, 60),
        goodCount: cur.goodCount + randInt(0, 5),
        rejectCount: cur.rejectCount + randInt(0, 1),
        temperature: drift(cur.temperature, 0.5, 30, 110),
        pressure: drift(cur.pressure, 0.05, 0, 10),
        vibration: drift(cur.vibration, 0.2, 0, 35)
      }
      arr.push({ ts: t.toISOString(), metrics: cur })
      t = t.add(1, 'minute')
    }
    return arr
  }

  getHalls() { return this.halls }
  getHall(id) {
    const hall = this.halls.find(h => h.id === id)
    if (!hall) return null
    const machines = hall.machineIds.map(mid => this.machines.get(mid))
    return { ...hall, machines }
  }
  getMachines() { return Array.from(this.machines.values()) }
  getMachine(id) { return this.machines.get(id) }
  getMachineMetricsHistory(id) { return this.metricsHistory.get(id) ?? [] }

  pushEvent(evt) {
    EventSchema.parse(evt)
    this.events.push(evt)
    if (this.events.length > this.maxEvents) this.events.shift()
  }
  tailEventsSince(iso) {
    const t = dayjs(iso)
    if (!t.isValid()) return []
    return this.events.filter(e => dayjs(e.ts).isAfter(t))
  }

  updateStep(env) {
    const now = Date.now()
    const nowISO = new Date(now).toISOString()
    // Hol bazlı kolektif "şok" (kısa süreli dalga)
    if (Math.random() < 0.002 * env.VOLATILITY_MULTIPLIER) {
      const hall = this.halls[Math.floor(Math.random() * this.halls.length)]
      this.hallShock.set(hall.id, {
        amp: (Math.random() * 0.6 + 0.2) * env.VOLATILITY_MULTIPLIER,
        decay: 0.92,
        until: now + 10000
      })
    }
    for (const [hid, s] of this.hallShock.entries()) {
      if (now > s.until) this.hallShock.delete(hid)
      else s.amp *= s.decay
    }

    for (const machine of this.machines.values()) {
      const msKey = machine.id
      // DOWN/MAINTENANCE olasılıkları
      if (Math.random() < env.DOWN_PROB_PER_SEC) {
        machine.status = Math.random() < 0.5 ? 'DOWN' : 'MAINTENANCE'
        this.pushEvent({
          id: newId(),
          machineId: msKey,
          type: 'ALARM',
          code: machine.status === 'DOWN' ? 'E-STOP' : 'PM',
          message: machine.status === 'DOWN' ? 'Emergency stop tetiklendi' : 'Planlı bakım başladı',
          ts: nowISO
        })
      } else if (machine.status !== 'RUNNING' && Math.random() < env.RECOVERY_PROB_PER_SEC) {
        machine.status = 'RUNNING'
        this.pushEvent({
          id: newId(),
          machineId: msKey,
          type: 'INFO',
          code: 'RESUME',
          message: 'Makine RUNNING durumuna geçti',
          ts: nowISO
        })
      }
      // Mikro duruş (3–10 sn arası)
      const microActive = (this.machineMicroStopUntil.get(msKey) || 0) > now
      if (!microActive && Math.random() < 0.02 * env.VOLATILITY_MULTIPLIER) {
        const dur = 3000 + Math.random() * 7000
        this.machineMicroStopUntil.set(msKey, now + dur)
        this.pushEvent({
          id: newId(),
          machineId: msKey,
          type: 'WARN',
          code: 'MICRO-STOP',
          message: `Kısa duruş (${Math.round(dur / 1000)}s)`,
          ts: nowISO
        })
      }
      // aynı hol içindekilere toplu itki
      const shock = this.hallShock.get(machine.hallId)?.amp ?? 0
      const vMul = Math.max(env.VOLATILITY_MULTIPLIER, 0.1)
      const cur = machine.metrics

      let next = {
        oee: drift(cur.oee, 0.5 * vMul, 15, 99),
        availability: drift(cur.availability, 0.4 * vMul, 15, 100),
        performance: drift(cur.performance, 0.5 * vMul, 15, 100),
        quality: drift(cur.quality, 0.25 * vMul, 60, 100),
        throughputPerMin: drift(
          cur.throughputPerMin,
          0.6 * vMul + shock * 2,
          machine.status === 'RUNNING' ? 0 : 0,
          machine.status === 'RUNNING' ? 18 : 3
        ),
        cycleTimeSec: clamp(60 / Math.max(cur.throughputPerMin, 0.1), 2, 120),
        goodCount: cur.goodCount + (microActive ? 0 : randInt(0, machine.status === 'RUNNING' ? 12 : 1)),
        rejectCount: cur.rejectCount + randInt(0, machine.status === 'RUNNING' ? 3 : 1),
        temperature: drift(cur.temperature, 0.7 * vMul + shock * 5, 20, 118),
        pressure: drift(cur.pressure, 0.08 * vMul, 0, 10),
        vibration: drift(cur.vibration, 0.3 * vMul + shock * 3, 0, 45)
      }
      // Mikro-duruşta throughput neredeyse 0
      if (microActive) next.throughputPerMin = drift(0.2, 0.2, 0, 1)
      machine.metrics = next
      machine.lastUpdateTs = nowISO
      // Basit kural bazlı alarmlar (eşik aşımları)
      const rules = [
        { key: 'TEMP-HIGH', cond: () => next.temperature > 95, level: 'WARN', msg: 'Sıcaklık yüksek' },
        { key: 'VIB-HIGH',  cond: () => next.vibration > 30,   level: 'WARN', msg: 'Titreşim yüksek' },
        { key: 'QUAL-LOW',  cond: () => next.quality < 85,     level: 'WARN', msg: 'Kalite düşüşü' }
      ]
      for (const r of rules) {
        const k = `${r.key}:${msKey}`
        const active = this.activeRuleAlarms.has(k)
        if (r.cond() && !active) {
          this.activeRuleAlarms.add(k)
          this.pushEvent({ id: newId(), machineId: msKey, type: r.level, code: r.key, message: r.msg, ts: nowISO })
        } else if (!r.cond() && active) {
          this.activeRuleAlarms.delete(k)
          this.pushEvent({ id: newId(), machineId: msKey, type: 'INFO', code: `${r.key}-CLEAR`, message: `${r.msg} normale döndü`, ts: nowISO })
        }
      }
      // Ekstra rastlantısal uyarılar
      if (Math.random() < env.ALARM_EXTRA_RATE) {
        const pool = [
          ['FEED', 'Hammadde beslemesi dalgalı'],
          ['SENSOR', 'Sensör sinyali zayıf'],
          ['LUBE', 'Yağlama seviyesi düşük']
        ]
        const [code, message] = pool[Math.floor(Math.random() * pool.length)]
        this.pushEvent({ id: newId(), machineId: msKey, type: 'WARN', code, message, ts: nowISO })
      }
      // Dakikalık tarihçe (grafikler 1 dk çözünürlükte)
      const hist = this.metricsHistory.get(msKey)
      if (hist?.length) {
        const last = hist[hist.length - 1]
        if (Math.abs(new Date(nowISO) - new Date(last.ts)) >= 60_000) {
          hist.push({ ts: nowISO, metrics: next })
          if (hist.length > 24 * 60) hist.shift()
        }
      }
    }
  }

  getSummary() {
    const all = this.getMachines()
    const total = all.length
    const running = all.filter(m => m.status === 'RUNNING').length
    const down = all.filter(m => m.status === 'DOWN').length
    const avgOEE = total ? all.reduce((s, m) => s + m.metrics.oee, 0) / total : 0
    const totalThroughput = all.reduce((s, m) => s + m.metrics.throughputPerMin, 0)
    const activeAlarms = this.events.filter(e => e.type === 'ALARM').slice(-50).length
    return {
      totalMachines: total,
      running,
      down,
      avgOEE: Number(avgOEE.toFixed(1)),
      totalThroughput: Number(totalThroughput.toFixed(2)),
      activeAlarms
    }
  }
}

export const dataService = new DataService()
