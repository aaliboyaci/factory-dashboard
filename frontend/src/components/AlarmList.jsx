import React from 'react'

export default function AlarmList({ alarms }) {
  return (
    <div className="card p-3">
      <div className="text-xs text-slate-400 mb-2">Active Alarms (tail ~1m)</div>
      <div className="space-y-2 max-h-64 overflow-auto pr-1">
        {alarms.length === 0 && <div className="text-sm text-slate-500">No active alarms</div>}
        {alarms.map(a => (
          <div key={a.id} className="flex items-center justify-between text-sm">
            <div>
              <span className="text-red-400 font-semibold mr-2">{a.code}</span>
              <span className="text-slate-300">{a.message}</span>
            </div>
            <div className="text-xs text-slate-500">{new Date(a.ts).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
