import React from 'react'
export default function Toast({ show, message }) {
  if (!show) return null
  return (
    <div className="fixed bottom-4 right-4 bg-slate-900 border border-slate-700 px-3 py-2 rounded shadow">
      <span className="text-sm">{message}</span>
    </div>
  )
}
