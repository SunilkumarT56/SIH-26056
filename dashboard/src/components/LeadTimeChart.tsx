import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from './Card'
import { chartColors, leadTimeData } from '../data/mockData'

export function LeadTimeChart() {
  return (
    <Card title="Lead-Time Elasticity">
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={leadTimeData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="window" axisLine={false} tickLine={false} dy={8} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{
                background: '#2a2a2a',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Median Fare']}
            />
            <Bar dataKey="fare" fill={chartColors.orange} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {[
          { label: 'Short-notice premium', value: '+48.7%' },
          { label: 'Median fare', value: '₹5,600' },
          { label: 'Highest premium', value: 'DEL-MAA' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-notion-surface px-3 py-2.5 ring-1 ring-notion-border">
            <p className="text-[11px] text-notion-text-tertiary">{s.label}</p>
            <p className="mt-0.5 text-[14px] font-semibold text-notion-text">{s.value}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
