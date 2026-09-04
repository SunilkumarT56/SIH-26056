import { ArrowUpRight } from 'lucide-react'
import { kpis } from '../data/mockData'

const items = [
  {
    label: 'Airfare Price Index',
    value: kpis.index.toFixed(1),
    sub: 'Base = 100',
    trend: null,
  },
  {
    label: 'MoM Change',
    value: `${kpis.momChange}%`,
    sub: 'vs last month',
    trend: 'up' as const,
  },
  {
    label: 'YoY Change',
    value: `${kpis.yoyChange}%`,
    sub: 'vs last year',
    trend: 'up' as const,
  },
  {
    label: 'Valid Observations',
    value: kpis.observations,
    sub: `${kpis.coverage}% coverage`,
    trend: null,
  },
]

export function KPICards() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="group rounded-xl border border-notion-border bg-notion-card/60 p-5 transition-all hover:border-notion-border-strong hover:bg-notion-card"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-notion-text-tertiary">
            {item.label}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[28px] font-semibold tabular-nums tracking-[-0.03em] text-notion-text">
              {item.trend === 'up' && (
                <ArrowUpRight className="mr-0.5 inline h-5 w-5 text-notion-red" strokeWidth={2.5} />
              )}
              {item.value}
            </span>
          </div>
          <p className="mt-1 text-[12px] text-notion-text-secondary">{item.sub}</p>
        </div>
      ))}
    </div>
  )
}
