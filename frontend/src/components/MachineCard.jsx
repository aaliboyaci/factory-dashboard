import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusPill from './StatusPill'
import LastUpdateBadge from './LastUpdateBadge'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

export default function MachineCard({ m }) {
  const [spark, setSpark] = useState([])
  useEffect(() => {
    const v = Number(m.metrics?.throughputPerMin ?? 0)
    setSpark(prev => [...prev.slice(-19), { t: Date.now(), v }])
  }, [m.metrics?.throughputPerMin])

  const oee = `${m.metrics?.oee?.toFixed(1) ?? 0}%`
  const thr = `${m.metrics?.throughputPerMin?.toFixed(2) ?? 0} u/min`
  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{m.name}</div>
        <StatusPill status={m.status} />
      </div>
      <div className="text-sm text-slate-300 grid grid-cols-2 gap-2">
        <div>OEE: <span className="font-semibold">{oee}</span></div>
        <div>Throughput: <span className="font-semibold">{thr}</span></div>
        <div>Quality: {m.metrics?.quality?.toFixed(1)}%</div>
        <div>Perf.: {m.metrics?.performance?.toFixed(1)}%</div>
      </div>
      <div className="h-10">
        <ResponsiveContainer>
          <LineChart data={spark}>
            <Line type="monotone" dataKey="v" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between mt-1">
        <LastUpdateBadge iso={m.lastUpdateTs} />
        <Link to={`/machine/${m.id}`} className="text-xs underline text-slate-300">Detay</Link>
      </div>
    </div>
  )
}
