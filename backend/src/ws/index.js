import { wsHub } from '../services/ws.service.js'
import { dataService } from '../services/data.service.js'
import { env } from '../config/env.js'

export const attachWs = (wss) => {
  wss.on('connection', (ws) => {
    wsHub.addClient(ws)
    ws.send(JSON.stringify({ type: 'hello', payload: { ok: true } }))

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString())
        if (msg?.type === 'subscribe') {
          wsHub.setFilter(ws, msg.hallId ?? null)
          ws.send(JSON.stringify({ type: 'subscribed', payload: { hallId: msg.hallId ?? null } }))
        }
      } catch {
        ws.send(JSON.stringify({ type: 'error', payload: { message: 'invalid ws message' } }))
      }
    })

    ws.on('close', () => wsHub.removeClient(ws))
  })

  setInterval(() => {
    for (const m of dataService.getMachines()) {
      wsHub.broadcast(
        'telemetry',
        { machineId: m.id, metrics: m.metrics, ts: m.lastUpdateTs },
        m.hallId
      )
    }
  }, env.WS_BROADCAST_INTERVAL_MS)
}
