import { create } from 'zustand'
import api from '../utils/api'
import dayjs from 'dayjs'

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:4000/ws'

export const useFactoryStore = create((set, get) => ({
  summary: null,
  halls: [],
  selectedHallId: 'hall-a',
  machines: [],
  alarms: [],
  connectionStatus: 'DISCONNECTED',
  ws: null,
  eventsTimer: null,

  setHall: async (id) => {
    set({ selectedHallId: id })
    await get().fetchHall(id)
    const ws = get().ws
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'subscribe', hallId: id }))
    }
  },

  fetchSummary: async () => {
    const { data } = await api.get('/summary')
    set({ summary: data })
  },

  fetchHalls: async () => {
    const { data } = await api.get('/halls')
    set({ halls: data })
  },

  fetchHall: async (id) => {
    const { data } = await api.get(`/halls/${id}`)
    set({ machines: data.machines })
  },

  ingestTelemetry: ({ machineId, metrics, ts }) => {
    set((state) => ({
      machines: state.machines.map(m => m.id === machineId ? { ...m, metrics, lastUpdateTs: ts } : m)
    }))
  },

  tailEvents: async () => {
    const since = dayjs().subtract(1, 'minute').toISOString()
    const { data } = await api.get('/events', { params: { since } })
    set({ alarms: data.filter(e => e.type === 'ALARM').slice(-50) })
  },

  connectWs: () => {
    if (get().ws) return
    const ws = new WebSocket(WS_URL)
    set({ ws, connectionStatus: 'CONNECTING' })
    ws.onopen = () => {
      set({ connectionStatus: 'CONNECTED' })
      ws.send(JSON.stringify({ type: 'subscribe', hallId: get().selectedHallId }))
    }
    ws.onclose = () => {
      set({ ws: null, connectionStatus: 'DISCONNECTED' })
      setTimeout(() => get().connectWs(), 1500) // basit backoff
    }
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        if (msg.type === 'telemetry') get().ingestTelemetry(msg.payload)
      } catch {}
    }
    // Alarm tail için polling
    get().tailEvents()
    const t = setInterval(get().tailEvents, 10000)
    set({ eventsTimer: t })
  },

  disconnectWs: () => {
    const ws = get().ws
    if (ws) ws.close()
    const t = get().eventsTimer
    if (t) clearInterval(t)
    set({ ws: null, eventsTimer: null, connectionStatus: 'DISCONNECTED' })
  }
}))
