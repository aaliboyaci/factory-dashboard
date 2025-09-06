import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import pino from 'pino'
import { env, isDev } from './config/env.js'
import api from './routes/index.js'
import { metricsService } from './services/metrics.service.js'
import { attachWs } from './ws/index.js'

const logger = pino(isDev ? { transport: { target: 'pino-pretty' } } : {})

const app = express()
app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(express.json())

app.get('/healthz', (_, res) => res.json({ ok: true }))
app.use('/api', api)

const server = createServer(app)
const wss = new WebSocketServer({ server, path: env.WS_PATH })
attachWs(wss)
metricsService.start()

server.listen(env.PORT, () => {
  logger.info(`Backend http://localhost:${env.PORT}  ws:${env.WS_PATH}`)
})
