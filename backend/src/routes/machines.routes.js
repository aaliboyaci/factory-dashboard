import { Router } from 'express'
import { listMachines, machineMetrics } from '../controllers/machines.controller.js'
const r = Router()
r.get('/', listMachines)
r.get('/:id/metrics', machineMetrics)
export default r
