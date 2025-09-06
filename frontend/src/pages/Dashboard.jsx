import React, { useEffect, useState } from 'react'
import { useFactoryStore } from '../store/factoryStore'
import { SummaryStrip } from '../components/KpiCard'
import HallSelector from '../components/HallSelector'
import MachineCard from '../components/MachineCard'
import MachineTable from '../components/MachineTable'
import TrendMiniChart from '../components/TrendMiniChart'
import AlarmList from '../components/AlarmList'
import api from '../utils/api'
import dayjs from 'dayjs'

export default function Dashboard() {
  const { summary, machines, selectedHallId, alarms } = useFactoryStore()
  const [hallOeeTrend, setHallOeeTrend] = useState([])
  const [liveOee, setLiveOee] = useState([]) // son 60 saniye canlı
  // Hol bazlı son 30dk OEE ortalaması (dakikada 1 güncellenir) — 15 sn’de bir yenile.
  // ÖNEMLİ: closure yerine her çağrıda güncel store'dan machines al.
  useEffect(() => {
    let cancelled = false
    let timer
    const loadTrend = async () => {
      const { machines: machinesNow } = useFactoryStore.getState()
      if (!machinesNow || machinesNow.length === 0) return // veri yoksa önceki grafiği koru

      const histories = await Promise.all(
        machinesNow.map((m) => api.get(`/machines/${m.id}/metrics`).then((r) => r.data.slice(-30)))
      )
      const points = Array.from({ length: 30 }).map((_, i) => {
        const vals = histories.map((h) => h[h.length - 30 + i]?.metrics?.oee ?? 0)
        const t = histories[0]?.[histories[0].length - 30 + i]?.ts
        const avg = vals.reduce((a, b) => a + b, 0) / (vals.length || 1)
        return { t, oee: Number(avg.toFixed(1)) }
      })

      if (!cancelled) setHallOeeTrend(points)
    }
    loadTrend()
    timer = setInterval(loadTrend, 15000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [selectedHallId])

  // Canlı: her telemetry ile makine listesi değiştiğinde hall ortalamasını push et (60 sn buffer)
  useEffect(() => {
    if (!machines?.length) return
    const avg = machines.reduce((s, m) => s + (m.metrics?.oee ?? 0), 0) / machines.length
    setLiveOee((prev) => [...prev.slice(-59), { t: dayjs().toISOString(), oee: Number(avg.toFixed(1)) }])
  }, [machines])

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <SummaryStrip summary={summary} />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3 space-y-4">
          <HallSelector />
          <AlarmList alarms={alarms} />
        </div>
        <div className="col-span-12 md:col-span-9 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TrendMiniChart title="OEE (live 60s)" data={liveOee} height={180} />
            <TrendMiniChart title="OEE (last 30 min)" data={hallOeeTrend} height={180} />
          </div>
           <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            {machines?.length
              ? machines.map((m) => <MachineCard key={m.id} m={m} />)
              : Array.from({ length: 3 }).map((_, i) => <div key={i} className="card h-28 animate-pulse" />)}
          </div>
          <MachineTable data={machines || []} />
        </div>
      </div>
    </main>
  )
}
