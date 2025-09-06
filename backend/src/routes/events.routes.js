// events.routes.js
import { Router } from 'express'
import { tailEvents } from '../controllers/events.controller.js'
const r = Router()
r.get('/', tailEvents) // /api/events?since=ISO
export default r
