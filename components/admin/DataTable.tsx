import { ReactNode } from 'react'

interface Column<T> {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  empty?: string
  onRowClick?: (row: T) => void
  rowKey?: keyof T
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  empty = 'No data',
  onRowClick,
  rowKey,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="p-8 text-center text-muted">
        <p>Loading...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-muted">
        <p>{empty}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-light">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left font-medium text-text"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={rowKey ? String(row[rowKey]) : idx}
              className={`border-b border-border ${
                onRowClick ? 'cursor-pointer hover:bg-light transition-colors' : ''
              }`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3">
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
