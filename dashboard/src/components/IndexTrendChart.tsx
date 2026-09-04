import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartColors, trendData } from '../data/mockData'
import { Card } from './Card'

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-notion-border bg-notion-elevated px-3 py-2 shadow-xl">
      <p className="text-[11px] text-notion-text-tertiary">{label}</p>
      <p className="text-[14px] font-semibold tabular-nums text-notion-text">{payload[0].value}</p>
    </div>
  )
}

export function IndexTrendChart() {
  return (
    <Card title="Airfare Index Trend">
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.blue} stopOpacity={0.25} />
                <stop offset="100%" stopColor={chartColors.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} dy={8} />
            <YAxis domain={[98, 125]} axisLine={false} tickLine={false} dx={-4} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="index"
              stroke={chartColors.blue}
              strokeWidth={2}
              fill="url(#trendGrad)"
              dot={{ r: 3, fill: chartColors.blue, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: chartColors.blue, stroke: '#191919', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
