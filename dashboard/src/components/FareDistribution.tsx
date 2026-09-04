import { Card } from './Card'
import { fareDistribution } from '../data/mockData'

export function FareDistribution() {
  return (
    <Card title="Fare Distribution">
      <div className="space-y-3.5">
        {fareDistribution.map((d) => (
          <div key={d.label} className="flex items-center gap-4">
            <span className="w-14 text-[12px] font-medium text-notion-text-tertiary">{d.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-notion-surface ring-1 ring-notion-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-notion-blue/80 to-notion-purple/60 transition-all duration-500"
                style={{ width: `${d.width}%` }}
              />
            </div>
            <span className="w-16 text-right text-[13px] font-medium tabular-nums text-notion-text">
              ₹{d.value.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-between text-[10px] text-notion-text-tertiary">
        {['₹4K', '₹5K', '₹6K', '₹7K', '₹8K', '₹9K', '₹10K'].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </Card>
  )
}
