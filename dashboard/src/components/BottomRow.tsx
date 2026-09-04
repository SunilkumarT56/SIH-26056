import { ChevronDown } from 'lucide-react'
import { allocationBars, insights, riskScore } from '../data/mockData'

export function AllocationCard() {
  return (
    <section className="flex h-full flex-col rounded-[28px] bg-notion-card p-6 ring-1 ring-white/6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-medium text-white">Allocation performance</h3>
          <button
            type="button"
            className="mt-2 inline-flex items-center gap-1 text-[12px] text-white/45 hover:text-white/70"
          >
            Route pressure
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
        <div className="flex gap-1 rounded-lg bg-white/5 p-1">
          <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] text-white">▮▮</span>
          <span className="px-2 py-1 text-[10px] text-white/30">☰</span>
        </div>
      </div>

      <div className="mt-8 flex h-[220px] items-end justify-around gap-3 px-2">
        {allocationBars.map((bar) => (
          <div key={bar.label} className="flex h-full w-full max-w-[72px] flex-col items-center justify-end">
            <span className="mb-2 text-[13px] font-medium tabular-nums text-white/80">{bar.pct}%</span>
            <div
              className="hatch-fill w-full rounded-t-2xl rounded-b-md"
              style={{ height: `${bar.pct}%`, backgroundColor: bar.color, minHeight: bar.pct < 12 ? 18 : undefined }}
            />
            <span className="mt-3 text-[11px] text-white/45">{bar.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const [sx, sy] = polar(cx, cy, r, startDeg)
  const [ex, ey] = polar(cx, cy, r, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`
}

export function RiskCard() {
  const pct = riskScore.value / riskScore.max
  const cx = 100
  const cy = 100
  const r = 68
  const start = 225
  const sweep = 270
  const end = start + sweep * pct
  const [kx, ky] = polar(cx, cy, r, end)

  return (
    <section className="flex h-full flex-col rounded-[28px] bg-notion-card p-6 ring-1 ring-white/6">
      <div>
        <h3 className="text-[16px] font-medium text-white">Fare pressure</h3>
        <p className="mt-3 text-[42px] font-semibold leading-none tracking-[-0.04em] tabular-nums text-white">
          {riskScore.value}
          <span className="text-[22px] font-medium text-white/35"> / {riskScore.max}</span>
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center py-6">
        <svg viewBox="0 0 200 200" className="h-[200px] w-[200px] overflow-visible" aria-hidden>
          <path
            d={arcPath(cx, cy, r, start, start + sweep)}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d={arcPath(cx, cy, r, start, end)}
            fill="none"
            stroke="#c6f54a"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <circle cx={kx} cy={ky} r="9" fill="#fff" />
        </svg>
      </div>

      <p className="text-center text-[13px] leading-snug text-white/45">{riskScore.note}</p>
    </section>
  )
}

export function InsightsCard() {
  return (
    <section className="flex h-full flex-col rounded-[28px] bg-notion-card p-6 ring-1 ring-white/6">
      <h3 className="text-[16px] font-medium text-white">Industry insights</h3>
      <p className="font-serif mt-6 text-[17px] italic leading-[1.55] tracking-[0.01em] text-white/85">
        {insights.body}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-8">
        {insights.sources.map((s, i) => (
          <span
            key={s.id}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[9px] font-bold ring-1 ring-white/10"
            style={{
              background: i === 3 ? '#f05a1a' : '#1a1a1a',
              color: i === 3 ? '#fff' : 'rgba(255,255,255,0.7)',
            }}
          >
            {s.id}
          </span>
        ))}
      </div>
    </section>
  )
}

export function BottomRow() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
      <AllocationCard />
      <RiskCard />
      <InsightsCard />
    </div>
  )
}
