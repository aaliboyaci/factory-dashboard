import { env } from '../config/env.js'

function parseList(input) {
  if (!input) return []
  return String(input)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

const explicitList = new Set(parseList(env.CORS_ORIGIN))
const suffixList = parseList(process.env.CORS_ORIGIN_SUFFIXES)

;['http://localhost:5173', 'https://localhost:5173'].forEach(o => explicitList.add(o))

function isAllowed(origin = '') {
  if (explicitList.has(origin)) return true
  return suffixList.some(suf => origin.endsWith(suf))
}

export const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true)
    if (isAllowed(origin)) return cb(null, true)
    return cb(new Error(`Not allowed by CORS: ${origin}`))
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
}
