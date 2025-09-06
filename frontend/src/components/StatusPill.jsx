import React from 'react'
const map = {
  RUNNING: 'bg-running/20 text-running border-running/40',
  IDLE: 'bg-idle/20 text-idle border-idle/40',
  DOWN: 'bg-down/20 text-down border-down/40',
  MAINTENANCE: 'bg-maintenance/20 text-maintenance border-maintenance/40'
}
export default function StatusPill({ status }) {
  return <span className={`badge ${map[status] || ''}`}>{status}</span>
}
