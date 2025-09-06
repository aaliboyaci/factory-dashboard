import React from 'react'
export default function EmptyState({ title="No Data", desc="Henüz veri yok." }) {
  return (
    <div className="card p-6 text-center">
      <div className="text-lg font-semibold mb-1">{title}</div>
      <div className="text-sm text-slate-400">{desc}</div>
    </div>
  )
}
