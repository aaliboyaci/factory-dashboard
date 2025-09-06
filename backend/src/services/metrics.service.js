import { dataService } from './data.service.js'
import { env } from '../config/env.js'

class MetricsService {
  start() {
    const base = env.UPDATE_INTERVAL_MS / Math.max(env.MOCK_SPEED_FACTOR, 0.1)
    this.timer = setInterval(() => dataService.updateStep(env), base)
  }
  stop() {
    if (this.timer) clearInterval(this.timer)
  }
}

export const metricsService = new MetricsService()
