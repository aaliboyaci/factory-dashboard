import { Router } from 'express'
import summary from './summary.routes.js'
import halls from './halls.routes.js'
import machines from './machines.routes.js'
import events from './events.routes.js'
const api = Router()
api.use('/summary', summary)
api.use('/halls', halls)
api.use('/machines', machines)
api.use('/events', events)
export default api
