export const seedHalls = [
  { id: 'hall-a', name: 'Hall-A', machineIds: ['m-a-1', 'm-a-2', 'm-a-3'] },
  { id: 'hall-b', name: 'Hall-B', machineIds: ['m-b-1', 'm-b-2', 'm-b-3'] }
]

export const seedMachines = [
  { id: 'm-a-1', name: 'M1', hallId: 'hall-a' },
  { id: 'm-a-2', name: 'M2', hallId: 'hall-a' },
  { id: 'm-a-3', name: 'M3', hallId: 'hall-a' },
  { id: 'm-b-1', name: 'M1', hallId: 'hall-b' },
  { id: 'm-b-2', name: 'M2', hallId: 'hall-b' },
  { id: 'm-b-3', name: 'M3', hallId: 'hall-b' }
]
