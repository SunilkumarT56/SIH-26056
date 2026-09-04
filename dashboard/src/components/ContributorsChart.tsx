import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card } from './Card'
import { chartColors, contributors } from '../data/mockData'

const COLORS = [chartColors.red, chartColors.orange, chartColors.blue, chartColors.purple, chartColors.gray]

export function ContributorsChart() {
  const total = contributors.reduce((s, c) => s + c.value, 0)

  return (
    <Card title="Top Contributors to APIx Movement">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="h-[180px] w-full lg:w-[45%]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={contributors}
                dataKey="value"
                nameKey="route"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={3}
                stroke="none"
              >
                {contributors.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#2a2a2a',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v) => [`+${Number(v)} pp`, 'Contribution']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-0">
          {contributors.map((c, i) => (
            <div
              key={c.route}
              className="flex items-center justify-between border-b border-notion-border/50 py-2.5 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-[13px] text-notion-text-secondary">{c.route}</span>
              </div>
              <span className="text-[13px] font-semibold tabular-nums text-notion-text">+{c.value} pp</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2.5">
            <span className="text-[13px] font-medium text-notion-text">Total</span>
            <span className="text-[13px] font-semibold tabular-nums text-notion-blue">+{total.toFixed(1)} pp</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
