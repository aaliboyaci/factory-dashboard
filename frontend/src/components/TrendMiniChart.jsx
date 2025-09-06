import React from 'react'
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis, XAxis } from 'recharts'

export default function TrendMiniChart({ data, height = 140, title = 'OEE (last 30 min)', domain = [0, 100] }) {
  return (
    <div className="card p-3">
      <div className="text-xs text-slate-400 mb-2">{title}</div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="t" hide />
            <YAxis domain={domain} hide />
            <Tooltip formatter={(v)=>`${Number(v).toFixed(1)}%`} labelFormatter={()=>''} />
            <Line type="monotone" dataKey="oee" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
