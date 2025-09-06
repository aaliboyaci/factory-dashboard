import { z } from 'zod'

export const StatusEnum = z.enum(['RUNNING', 'IDLE', 'DOWN', 'MAINTENANCE'])
export const EventTypeEnum = z.enum(['ALARM', 'WARN', 'INFO'])

export const MetricsSchema = z.object({
  oee: z.number().min(0).max(100),
  availability: z.number().min(0).max(100),
  performance: z.number().min(0).max(100),
  quality: z.number().min(0).max(100),
  throughputPerMin: z.number().min(0),
  cycleTimeSec: z.number().min(0),
  goodCount: z.number().int().min(0),
  rejectCount: z.number().int().min(0),
  temperature: z.number().min(10).max(120),
  pressure: z.number().min(0).max(10),
  vibration: z.number().min(0).max(50)
})

export const MachineSchema = z.object({
  id: z.string(),
  name: z.string(),
  hallId: z.string(),
  status: StatusEnum,
  metrics: MetricsSchema,
  lastUpdateTs: z.string().datetime()
})

export const HallSchema = z.object({
  id: z.string(),
  name: z.string(),
  machineIds: z.array(z.string())
})

export const EventSchema = z.object({
  id: z.string(),
  machineId: z.string(),
  type: EventTypeEnum,
  code: z.string(),
  message: z.string(),
  ts: z.string().datetime()
})

export const SummarySchema = z.object({
  totalMachines: z.number().int().min(0),
  running: z.number().int().min(0),
  down: z.number().int().min(0),
  avgOEE: z.number().min(0).max(100),
  totalThroughput: z.number().min(0),
  activeAlarms: z.number().int().min(0)
})
