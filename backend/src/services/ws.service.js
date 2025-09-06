export class WsHub {
  constructor() {
    /** @type {Map<WebSocket, {hallId: string|null}>} */
    this.clients = new Map()
  }
  addClient(ws) { this.clients.set(ws, { hallId: null }) }
  removeClient(ws) { this.clients.delete(ws) }
  setFilter(ws, hallId) {
    const cur = this.clients.get(ws)
    if (cur) this.clients.set(ws, { ...cur, hallId })
  }
  broadcast(type, payload, hallId = null) {
    const msg = JSON.stringify({ type, payload })
    for (const [ws, filter] of this.clients.entries()) {
      if (ws.readyState !== 1) continue
      if (hallId && filter.hallId && filter.hallId !== hallId) continue
      ws.send(msg)
    }
  }
}
export const wsHub = new WsHub()
