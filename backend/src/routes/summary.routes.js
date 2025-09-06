import { Router } from 'express'
import { getSummary } from '../controllers/summary.controller.js'
const r = Router()
r.get('/', getSummary)
export default r
