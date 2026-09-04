import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from './Card'
import { chartColors, dgcaData } from '../data/mockData'

export function DGCAValidation() {
  return (
    <Card title="DGCA Validation / Backtesting">
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dgcaData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} dy={8} />
            <YAxis domain={[98, 122]} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: '#2a2a2a',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
              formatter={(v) => <span className="text-notion-text-secondary">{v}</span>}
            />
            <Line
              type="monotone"
              dataKey="apix"
              name="APIx"
              stroke={chartColors.blue}
              strokeWidth={2}
              dot={{ r: 3, fill: chartColors.blue }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="dgca"
              name="DGCA Benchmark"
              stroke={chartColors.green}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={{ r: 3, fill: chartColors.green }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: 'Correlation', value: '0.94' },
          { label: 'MAPE', value: '2.8%' },
          { label: 'Status', value: 'Validated', green: true },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-notion-surface px-3 py-2.5 text-center ring-1 ring-notion-border">
            <p className="text-[10px] uppercase tracking-wider text-notion-text-tertiary">{s.label}</p>
            <p className={`mt-0.5 text-[15px] font-semibold ${s.green ? 'text-notion-green' : 'text-notion-text'}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}
