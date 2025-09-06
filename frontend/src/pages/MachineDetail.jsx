import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts'

//Makine detay — son 24 saat metrik grafikleri
export default function MachineDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    let cancel = false
    api.get(`/machines/${id}/metrics`).then(res => { if (!cancel) setData(res.data) })
    return () => { cancel = true }
  }, [id])

  if (!data) return <main className="max-w-6xl mx-auto px-4 py-6"><div className="card h-48 animate-pulse" /></main>

  const last240 = data.slice(-240) // son 4 saat
  const barData = last240.map(d => ({ t: d.ts, thr: d.metrics.throughputPerMin, rej: d.metrics.rejectCount }))

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <Link to="/" className="text-xs underline">← Back</Link>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-3">
          <div className="text-xs text-slate-400 mb-2">OEE (line)</div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={last240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ts" hide />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(v)=>`${Number(v).toFixed(1)}%`} />
                <Line type="monotone" dataKey="metrics.oee" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-3">
          <div className="text-xs text-slate-400 mb-2">Throughput & Reject (bar)</div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="thr" />
                <Bar dataKey="rej" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  )
}
