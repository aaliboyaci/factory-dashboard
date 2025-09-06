import React, { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './router.jsx'
import { useFactoryStore } from '../store/factoryStore.js'

function getInitialDark() {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') return true
  if (saved === 'light') return false
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true
}

export default function App() {
  const { connectWs, disconnectWs, fetchSummary, fetchHall, fetchHalls } = useFactoryStore()
  const [dark, setDark] = useState(getInitialDark())
  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    fetchHalls().then(() => fetchHall('hall-a'))
    connectWs()
    fetchSummary()
    const t = setInterval(fetchSummary, 10000)
    return () => { clearInterval(t); disconnectWs() }
  }, [])

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 border-b border-slate-200
                         dark:bg-slate-950/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <h1 className="font-semibold">factory-dashboard</h1>
          </div>
          <button
            className="text-xs px-3 py-1 rounded border border-slate-300 hover:bg-slate-100
                       dark:border-slate-700 dark:hover:bg-slate-800"
            onClick={() => setDark(d => !d)}
            aria-label="Tema değiştir (Dark/Light)"
          >
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>
      <RouterProvider router={router} />
    </div>
  )
}
