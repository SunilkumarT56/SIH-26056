import { useMemo, useState } from 'react'
import { Maximize2, RefreshCw, SlidersHorizontal } from 'lucide-react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { breakdownCards, healthScore, kpis, trendData } from '../data/mockData'

const ranges = ['1D', '1W', '1M', '3M', '1Y', 'All'] as const

function HealthMeter({ score }: { score: number }) {
  const segments = 12
  const filled = Math.round((score / 100) * segments)
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-end gap-[3px]">
        {Array.from({ length: segments }).map((_, i) => (
          <span
            key={i}
            className={`w-[5px] rounded-sm ${i < filled ? 'bg-white' : 'bg-white/15'}`}
            style={{ height: 10 + i * 1.4 }}
          />
        ))}
      </div>
      <span className="text-[13px] font-medium text-white/80">{score}</span>
    </div>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const may = trendData.find((d) => d.month === 'May')?.index ?? 110
  const current = payload[0].value
  const pct = (((current - may) / may) * 100).toFixed(2)
  return (
    <div className="min-w-[168px] rounded-2xl bg-black/90 px-4 py-3 shadow-2xl ring-1 ring-white/10">
      <p className="text-[11px] text-white/45">May 1 — {label} 31</p>
      <p className="mt-1 text-[13px] font-medium tabular-nums text-white">
        {may.toFixed(1)} → {current.toFixed(1)}
      </p>
      <p className="mt-1 text-[12px] font-medium text-notion-green">+{pct}%</p>
    </div>
  )
}

export function HeroPerformance() {
  const [range, setRange] = useState<(typeof ranges)[number]>('1Y')

  const data = useMemo(() => {
    if (range === '1M') return trendData.slice(-2)
    if (range === '3M') return trendData.slice(-3)
    if (range === '1W' || range === '1D') return trendData.slice(-2)
    return trendData
  }, [range])

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <h2 className="text-[15px] font-medium text-white/90">Airfare index performance</h2>
          <HealthMeter score={healthScore} />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full bg-notion-elevated px-3 py-1.5 text-[12px] font-medium text-white/70 ring-1 ring-white/8 hover:text-white"
          >
            Filters
            <SlidersHorizontal className="h-3 w-3" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-white/10 text-white/60 hover:text-white"
            aria-label="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-white/10 text-white/60 hover:text-white"
            aria-label="Expand"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)]">
        <div className="flex flex-col justify-between rounded-[28px] bg-notion-card p-6 ring-1 ring-white/6 sm:p-8">
          <div>
            <p className="text-[13px] text-white/45">APIx index</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="text-[44px] font-semibold leading-none tracking-[-0.04em] tabular-nums text-white sm:text-[52px]">
                {kpis.index.toFixed(1)}
              </span>
              <span className="inline-flex items-center rounded-full bg-notion-green px-2.5 py-1 text-[12px] font-semibold text-black">
                ↗ +{kpis.momChange}%
              </span>
            </div>
            <p className="mt-2 text-[12px] text-white/35">Base = 100 · MoM · {kpis.lastUpdated}</p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3">
            {breakdownCards.map((card) => (
              <div
                key={card.label}
                className="relative overflow-hidden rounded-2xl bg-notion-elevated px-4 py-4 ring-1 ring-white/5"
              >
                <span
                  className="absolute left-0 top-3 h-8 w-[3px] rounded-r-full"
                  style={{ background: card.accent }}
                />
                <p className="pl-2 text-[12px] text-white/45">{card.label}</p>
                <p className="mt-1 pl-2 text-[22px] font-semibold tracking-tight tabular-nums text-white">
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] bg-notion-orange p-5 text-white sm:p-7">
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[13px] text-white/80">Index value</p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <span className="text-[36px] font-semibold leading-none tracking-[-0.04em] tabular-nums sm:text-[42px]">
                  {kpis.index.toFixed(1)}
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-black">
                  +{kpis.yoyChange}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[12px] font-medium text-white/70">
              {ranges.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={r === range ? 'text-white underline decoration-2 underline-offset-4' : 'hover:text-white'}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 h-[280px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 12, right: 8, left: -24, bottom: 0 }}>
                <defs>
                  <pattern
                    id="indexHatch"
                    width="8"
                    height="8"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(-45)"
                  >
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#fff" strokeWidth="1.5" opacity="0.28" />
                  </pattern>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} dy={8} tick={{ fill: 'rgba(255,255,255,0.7)' }} />
                <YAxis hide domain={['dataMin - 4', 'dataMax + 4']} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.35)', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="index"
                  stroke="#fff"
                  strokeWidth={2.4}
                  fill="url(#indexHatch)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#fff', stroke: '#f05a1a', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}
