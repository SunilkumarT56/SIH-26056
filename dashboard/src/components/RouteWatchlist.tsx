import { routeWatchlist } from '../data/mockData'

function Spark({ points, up }: { points: number[]; up: boolean }) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1
  const w = 88
  const h = 36
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w
      const y = h - ((p - min) / span) * (h - 4) - 2
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
  const color = up ? '#ff5a4a' : '#c6f54a'
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" aria-hidden>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

const logos: Record<string, { bg: string; fg: string; mark: string }> = {
  'DEL-BOM': { bg: '#1d4ed8', fg: '#fff', mark: '6E' },
  'BOM-BLR': { bg: '#c2410c', fg: '#fff', mark: 'AI' },
  'DEL-BLR': { bg: '#111', fg: '#fff', mark: 'QP' },
  'DEL-CCU': { bg: '#dc2626', fg: '#fff', mark: 'SG' },
}

export function RouteWatchlist() {
  return (
    <section className="rounded-[28px] bg-notion-card px-5 py-4 ring-1 ring-white/6 sm:px-7">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-medium text-white/90">Watchlist</h3>
        <span className="text-[12px] text-white/35">Top domestic routes</span>
      </div>
      <div className="flex gap-8 overflow-x-auto pb-1">
        {routeWatchlist.map((r) => {
          const up = r.change >= 0
          const logo = logos[r.code]
          return (
            <div key={r.code} className="flex min-w-[240px] flex-1 items-center gap-3 py-1">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                style={{ background: logo.bg, color: logo.fg }}
              >
                {logo.mark}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-white">{r.code}</p>
                <p className="truncate text-[11px] text-white/35">{r.name}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[13px] font-medium tabular-nums text-white">{r.index.toFixed(1)}</p>
                <p className={`text-[12px] font-medium tabular-nums ${up ? 'text-notion-red' : 'text-notion-green'}`}>
                  {up ? '+' : ''}
                  {r.change}%
                </p>
              </div>
              <Spark points={r.spark} up={up} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
