import React from 'react'
import { useFactoryStore } from '../store/factoryStore'

export default function HallSelector() {
  const { halls, selectedHallId, setHall } = useFactoryStore()

  return (
    <div className="card p-3">
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Halls</div>
      <div className="flex gap-2">
        {halls.map(h => {
          const selected = selectedHallId === h.id
          return (
            <button
              key={h.id}
              onClick={() => setHall(h.id)}
              aria-pressed={selected}
              aria-label={`Select ${h.name}`}
              className={[
                'px-3 py-1 rounded-md text-sm border transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/80',
                selected
                  ? 'bg-indigo-600 text-white border-transparent shadow-sm dark:bg-indigo-500'
                  : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50 ' +
                    'dark:bg-slate-900/40 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800'
              ].join(' ')}
            >
              {h.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
