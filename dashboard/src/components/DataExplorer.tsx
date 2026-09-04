import { Download, ExternalLink } from 'lucide-react'
import { Card } from './Card'
import { explorerData } from '../data/mockData'

function formatINR(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

export function DataExplorer() {
  return (
    <Card
      title="Data Explorer"
      action={
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-notion-surface px-2.5 py-1 text-[11px] font-medium text-notion-text-secondary ring-1 ring-notion-border transition-all hover:bg-notion-hover hover:text-notion-text"
          >
            <Download className="h-3 w-3" />
            Export CSV
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-notion-blue/10 px-2.5 py-1 text-[11px] font-medium text-notion-blue ring-1 ring-notion-blue/20 transition-all hover:bg-notion-blue/20"
          >
            <ExternalLink className="h-3 w-3" />
            Raw Data
          </button>
        </div>
      }
    >
      <div className="overflow-x-auto rounded-lg ring-1 ring-notion-border">
        <table className="w-full min-w-[640px] text-[12px]">
          <thead>
            <tr className="bg-notion-surface text-left text-[10px] uppercase tracking-wider text-notion-text-tertiary">
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">Airline</th>
              <th className="px-4 py-3 font-medium">Lead Time</th>
              <th className="px-4 py-3 font-medium">Base</th>
              <th className="px-4 py-3 font-medium">Tax</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {explorerData.map((row, i) => (
              <tr
                key={row.timestamp}
                className={`border-t border-notion-border/50 transition-colors hover:bg-notion-hover/40 ${
                  i % 2 === 0 ? 'bg-notion-card/30' : ''
                }`}
              >
                <td className="px-4 py-3 font-mono text-notion-text-tertiary">{row.timestamp}</td>
                <td className="px-4 py-3 font-medium text-notion-text">{row.route}</td>
                <td className="px-4 py-3 text-notion-text-secondary">{row.airline}</td>
                <td className="px-4 py-3 text-notion-text-secondary">{row.leadTime}</td>
                <td className="px-4 py-3 tabular-nums text-notion-text">{formatINR(row.base)}</td>
                <td className="px-4 py-3 tabular-nums text-notion-text-secondary">{formatINR(row.tax)}</td>
                <td className="px-4 py-3 tabular-nums font-medium text-notion-text">{formatINR(row.total)}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-notion-surface px-1.5 py-0.5 text-[10px] font-medium text-notion-text-tertiary ring-1 ring-notion-border">
                    {row.source}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
