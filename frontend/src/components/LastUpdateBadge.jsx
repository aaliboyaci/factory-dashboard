import React from 'react'
import { timeAgo } from '../utils/format'
export default function LastUpdateBadge({ iso }) {
  return <span className="text-xs text-slate-400">Last update: {timeAgo(iso)}</span>
}
