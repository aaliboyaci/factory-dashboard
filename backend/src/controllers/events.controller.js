import { dataService } from '../services/data.service.js'
export const tailEvents = (req, res) => {
  const { since } = req.query
  if (!since) return res.status(400).json({ error: 'since (ISO) query required' })
  res.json(dataService.tailEventsSince(since))
}
