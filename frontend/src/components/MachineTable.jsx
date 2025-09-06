import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'
import StatusPill from './StatusPill'
const columnHelper = createColumnHelper()

export default function MachineTable({ data = [] }) {
  const [statusFilter, setStatusFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Machine' }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => <StatusPill status={info.getValue()} />
      }),
      columnHelper.accessor(row => row.metrics?.oee, {
        id: 'oee',
        header: 'OEE %',
        cell: v => (v.getValue()?.toFixed(1) ?? '-')
      }),
      columnHelper.accessor(row => row.metrics?.throughputPerMin, {
        id: 'thr',
        header: 'Thr (u/min)',
        cell: v => (v.getValue()?.toFixed(2) ?? '-')
      }),
      columnHelper.accessor('lastUpdateTs', {
        header: 'Last Update',
        cell: v => new Date(v.getValue()).toLocaleTimeString()
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })
  const handleFilterChange = (val) => {
    setStatusFilter(val)
    setColumnFilters(val ? [{ id: 'status', value: val }] : [])
  }

  return (
    <div className="card p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-slate-500 dark:text-slate-400">Machines Table</div>
        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          aria-label="Duruma göre filtre"
          className="text-sm px-2 py-1 rounded border
                     bg-white text-slate-900 border-slate-300 hover:bg-slate-50
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/80
                     dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <option value="">All</option>
          <option value="RUNNING">RUNNING</option>
          <option value="IDLE">IDLE</option>
          <option value="DOWN">DOWN</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
        </select>
      </div>

      <table className="w-full text-sm">
        <thead className="text-slate-400">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th
                  key={h.id}
                  className="py-2 text-left cursor-pointer select-none"
                  onClick={h.column.getToggleSortingHandler()}
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                  {{ asc: ' ▲', desc: ' ▼' }[h.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(r => (
            <tr key={r.id} className="border-t border-slate-200 dark:border-slate-800">
              {r.getVisibleCells().map(c => (
                <td key={c.id} className="py-2">
                  {flexRender(c.column.columnDef.cell, c.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="text-xs px-2 py-1 border rounded
                     bg-white text-slate-900 border-slate-300 hover:bg-slate-50
                     disabled:opacity-40
                     dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Prev
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="text-xs px-2 py-1 border rounded
                     bg-white text-slate-900 border-slate-300 hover:bg-slate-50
                     disabled:opacity-40
                     dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Next
        </button>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </div>
      </div>
    </div>
  )
}
