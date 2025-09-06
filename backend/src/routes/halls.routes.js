import { Router } from 'express'
import { listHalls, getHall } from '../controllers/halls.controller.js'
const r = Router()
r.get('/', listHalls)
r.get('/:id', getHall)
export default r
