import { dataService } from '../services/data.service.js'
export const getSummary = (req, res) => res.json(dataService.getSummary())
