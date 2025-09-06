import { dataService } from '../services/data.service.js'
export const listHalls = (req, res) => res.json(dataService.getHalls())
export const getHall = (req, res) => {
  const hall = dataService.getHall(req.params.id)
  if (!hall) return res.status(404).json({ error: 'Hall not found' })
  res.json(hall)
}
