import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from './Card'
import { airlineData, chartColors } from '../data/mockData'

export function AirlineAnalysis() {
  return (
    <Card title="Airline Fare Analysis">
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={airlineData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="airline" axisLine={false} tickLine={false} dy={8} tick={{ fontSize: 10 }} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}K`} />
            <Tooltip
              contentStyle={{
                background: '#2a2a2a',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Avg Fare']}
            />
            <Bar dataKey="fare" fill={chartColors.blue} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-0">
        {airlineData.map((a) => (
          <div
            key={a.airline}
            className="flex items-center justify-between border-b border-notion-border/50 py-2.5 last:border-0"
          >
            <span className="text-[13px] text-notion-text-secondary">{a.airline}</span>
            <div className="flex items-center gap-4">
              <span className="text-[13px] tabular-nums text-notion-text">₹{a.fare.toLocaleString('en-IN')}</span>
              <span className={`w-16 text-right text-[12px] font-medium tabular-nums ${a.change >= 0 ? 'text-notion-red' : 'text-notion-green'}`}>
                {a.change >= 0 ? '▲' : '▼'} {Math.abs(a.change)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
