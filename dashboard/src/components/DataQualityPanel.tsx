import { Card } from './Card'
import { dataQuality, sourceHealth } from '../data/mockData'

export function DataQualityPanel() {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <Card title="Data Quality & Coverage">
        <div className="space-y-0">
          {dataQuality.map((d) => (
            <div
              key={d.label}
              className="flex items-center justify-between border-b border-notion-border/50 py-3 last:border-0"
            >
              <span className="text-[13px] text-notion-text-secondary">{d.label}</span>
              <span className={`text-[13px] tabular-nums ${d.highlight ? 'font-semibold text-notion-blue' : 'text-notion-text'}`}>
                {d.value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Data Source Health">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-notion-border text-left text-[11px] uppercase tracking-wider text-notion-text-tertiary">
                <th className="pb-3 font-medium">Source</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Success</th>
              </tr>
            </thead>
            <tbody>
              {sourceHealth.map((s) => (
                <tr key={s.source} className="border-b border-notion-border/50 last:border-0">
                  <td className="py-3 text-notion-text-secondary">{s.source}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        s.status === 'healthy' ? 'bg-notion-green' : 'bg-notion-yellow'
                      }`}
                    />
                  </td>
                  <td className="py-3 text-right tabular-nums font-medium text-notion-text">{s.success}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
