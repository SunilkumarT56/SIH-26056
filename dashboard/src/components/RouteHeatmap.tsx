import { Card } from './Card'
import { routeHeatmap } from '../data/mockData'

const severityDot: Record<string, string> = {
  high: 'bg-notion-red',
  medium: 'bg-notion-orange',
  low: 'bg-notion-yellow',
  positive: 'bg-notion-green',
}

export function RouteHeatmap() {
  return (
    <Card title="Route Airfare Heatmap">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-notion-border text-left text-[11px] uppercase tracking-wider text-notion-text-tertiary">
              <th className="pb-3 font-medium">Route</th>
              <th className="pb-3 font-medium">Index</th>
              <th className="pb-3 font-medium">Change</th>
              <th className="pb-3 font-medium w-8" />
            </tr>
          </thead>
          <tbody>
            {routeHeatmap.map((row) => (
              <tr
                key={row.route}
                className="border-b border-notion-border/50 transition-colors last:border-0 hover:bg-notion-hover/40"
              >
                <td className="py-3 font-medium text-notion-text">{row.route}</td>
                <td className="py-3 tabular-nums text-notion-text-secondary">{row.index.toFixed(1)}</td>
                <td className={`py-3 tabular-nums font-medium ${row.change >= 0 ? 'text-notion-red' : 'text-notion-green'}`}>
                  {row.change >= 0 ? '▲' : '▼'} {Math.abs(row.change)}%
                </td>
                <td className="py-3">
                  <span className={`inline-block h-2 w-2 rounded-full ${severityDot[row.severity]}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
