import dotenv from 'dotenv'
dotenv.config()
export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.BACKEND_PORT ?? 4000),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  WS_PATH: process.env.WS_PATH ?? '/ws',

  MOCK_SPEED_FACTOR: Number(process.env.MOCK_SPEED_FACTOR ?? 1),
  UPDATE_INTERVAL_MS: Number(process.env.UPDATE_INTERVAL_MS ?? 1000),
  WS_BROADCAST_INTERVAL_MS: Number(process.env.WS_BROADCAST_INTERVAL_MS ?? 1000),
  VOLATILITY_MULTIPLIER: Number(process.env.VOLATILITY_MULTIPLIER ?? 1),
  DOWN_PROB_PER_SEC: Number(process.env.DOWN_PROB_PER_SEC ?? 0.001),
  RECOVERY_PROB_PER_SEC: Number(process.env.RECOVERY_PROB_PER_SEC ?? 0.02),
  ALARM_EXTRA_RATE: Number(process.env.ALARM_EXTRA_RATE ?? 0.002),
  HALL_CORRELATION: Number(process.env.HALL_CORRELATION ?? 0.2)
}

export const isDev = env.NODE_ENV !== 'production'
