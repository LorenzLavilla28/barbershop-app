import { useState } from 'react'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'
import clsx from 'clsx'

export default function AdminTable({
  columns = [],
  data = [],
  searchable = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No records found',
  isLoading = false,
}) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [search, setSearch] = useState('')

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = data.filter((row) => {
    if (!search) return true
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  })

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (aVal === bVal) return 0
    const cmp = aVal > bVal ? 1 : -1
    return sortDir === 'asc' ? cmp : -cmp
  })

  return (
    <div className="glass-card overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-white/10">
          <div className="relative max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark pl-9 text-sm py-2"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={clsx(
                    'px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider',
                    col.sortable && 'cursor-pointer hover:text-zinc-300 select-none'
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4">
                      <div className="h-4 bg-white/5 rounded-full animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-zinc-500 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sorted.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-white/3 transition-colors group">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4 text-sm text-zinc-300 whitespace-nowrap">
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {sorted.length > 0 && (
        <div className="px-5 py-3 border-t border-white/10 text-xs text-zinc-600">
          Showing {sorted.length} of {data.length} records
        </div>
      )}
    </div>
  )
}
