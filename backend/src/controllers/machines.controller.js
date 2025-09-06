import { dataService } from '../services/data.service.js'
import { paginate } from '../utils/paginate.js'
export const listMachines = (req, res) => {
  const { status, hallId, page = 1, pageSize = 10 } = req.query
  let arr = dataService.getMachines()
  if (status) arr = arr.filter(m => m.status === String(status).toUpperCase())
  if (hallId) arr = arr.filter(m => m.hallId === hallId)
  res.json(paginate(arr, Number(page), Number(pageSize)))
}
export const machineMetrics = (req, res) => {
  const hist = dataService.getMachineMetricsHistory(req.params.id)
  if (!hist?.length) return res.status(404).json({ error: 'Machine or history not found' })
  res.json(hist)
}
