import { env } from '../config/env.js'

function parseList(input) {
  if (!input) return []
  return String(input).split(',').map(s => s.trim()).filter(Boolean)
}

const list = new Set(parseList(env.CORS_ORIGIN))
const suffixes = parseList(process.env.CORS_ORIGIN_SUFFIXES)

const defaultDev = ['http://localhost:5173', 'https://localhost:5173']
defaultDev.forEach(o => list.add(o))

function isAllowed(origin) {
  if (list.has(origin)) return true
  return suffixes.some(suf => origin.endsWith(suf))
}

export const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true) // healthz/curl
    if (isAllowed(origin)) return cb(null, true)
    cb(new Error(`Not allowed by CORS: ${origin}`))
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  optionsSuccessStatus: 204
}
