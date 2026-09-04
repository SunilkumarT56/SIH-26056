import { Card } from './Card'
import { volatility } from '../data/mockData'

const levelStyle: Record<string, { dot: string; text: string }> = {
  HIGH: { dot: 'bg-notion-red', text: 'text-notion-red' },
  MEDIUM: { dot: 'bg-notion-orange', text: 'text-notion-orange' },
  LOW: { dot: 'bg-notion-green', text: 'text-notion-green' },
}

export function VolatilityFestival() {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <Card title="Airfare Volatility">
        <div className="space-y-0">
          {volatility.map((v) => (
            <div
              key={v.route}
              className="flex items-center justify-between border-b border-notion-border/50 py-3 last:border-0"
            >
              <span className="text-[13px] text-notion-text-secondary">{v.route}</span>
              <span className={`flex items-center gap-2 text-[12px] font-semibold ${levelStyle[v.level].text}`}>
                <span className={`h-2 w-2 rounded-full ${levelStyle[v.level].dot}`} />
                {v.level}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-notion-text-tertiary">
          Max intraday change{' '}
          <span className="font-semibold text-notion-red">+38.4%</span>
        </p>
      </Card>

      <Card title="Demand / Festival Impact">
        <p className="text-[13px] font-medium text-notion-text">Diwali — DEL → MAA</p>
        <div className="mt-3 space-y-0">
          {[
            { label: 'Normal', value: '₹5,000' },
            { label: 'Festival', value: '₹9,200' },
            { label: 'Increase', value: '▲ 84%', highlight: true },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between border-b border-notion-border/50 py-3 last:border-0"
            >
              <span className="text-[13px] text-notion-text-secondary">{row.label}</span>
              <span className={`text-[13px] font-semibold tabular-nums ${row.highlight ? 'text-notion-red' : 'text-notion-text'}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-notion-text-tertiary">
          Pongal · Onam · Eid · Christmas · New Year
        </p>
      </Card>
    </div>
  )
}
