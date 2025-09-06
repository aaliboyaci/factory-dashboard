import React from 'react'

export default function KpiCard({ title, value, sub }) {
  return (
    <div className="card p-4">
      <div className="text-sm text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{typeof value === 'number' ? value : value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  )
}

export function SummaryStrip({ summary }) {
  if (!summary)
    return <div className="grid grid-cols-6 gap-3 my-4">{Array.from({ length: 6 }).map((_,i)=><div key={i} className="h-16 card animate-pulse" />)}</div>
  return (
    <div className="grid md:grid-cols-6 grid-cols-2 gap-3 my-4">
      <KpiCard title="Total Machines" value={summary.totalMachines} />
      <KpiCard title="Running" value={summary.running} />
      <KpiCard title="Down" value={summary.down} />
      <KpiCard title="Avg OEE" value={`${summary.avgOEE.toFixed(1)}%`} />
      <KpiCard title="Total Throughput" value={summary.totalThroughput.toFixed(2)} sub="units/min" />
      <KpiCard title="Active Alarms" value={summary.activeAlarms} />
    </div>
  )
}
