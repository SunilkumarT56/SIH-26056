import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card } from './Card'
import { chartColors, fareComposition } from '../data/mockData'

export function FareComposition() {
  return (
    <Card title="Consumer Fare Composition">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="h-[180px] w-full sm:w-[50%]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fareComposition}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={72}
                stroke="none"
              >
                {fareComposition.map((_, i) => (
                  <Cell key={i} fill={chartColors.pie[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#2a2a2a',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v, _, item) => [
                  `₹${Number(v).toLocaleString('en-IN')} (${(item?.payload as { percent: number })?.percent ?? 0}%)`,
                  '',
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full flex-1 space-y-0">
          {fareComposition.map((f, i) => (
            <div
              key={f.name}
              className="flex items-center justify-between border-b border-notion-border/50 py-2.5 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: chartColors.pie[i] }} />
                <span className="text-[13px] text-notion-text-secondary">{f.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[13px] tabular-nums text-notion-text">₹{f.value.toLocaleString('en-IN')}</span>
                <span className="w-12 text-right text-[12px] tabular-nums text-notion-text-tertiary">{f.percent}%</span>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2.5">
            <span className="text-[13px] font-medium text-notion-text">Consumer Paid</span>
            <span className="text-[13px] font-semibold tabular-nums text-notion-blue">₹4,920</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
