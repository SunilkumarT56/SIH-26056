import { Activity } from 'lucide-react'
import { kpis } from '../data/mockData'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-notion-border bg-notion-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-notion-elevated ring-1 ring-notion-border">
            <Activity className="h-4 w-4 text-notion-blue" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold tracking-[-0.01em] text-notion-text">
              Real-Time Airfare Price Index
            </h1>
            <p className="text-[12px] text-notion-text-secondary">
              NSO / RBI Analytics · High-Frequency Domestic Monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-green/10 px-2.5 py-1 text-[11px] font-medium text-notion-green ring-1 ring-notion-green/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-notion-green opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-notion-green" />
            </span>
            Live
          </span>
          <span className="hidden rounded-full bg-notion-elevated px-2.5 py-1 text-[11px] font-medium text-notion-text-secondary ring-1 ring-notion-border sm:inline">
            SIH-26056
          </span>
        </div>
      </div>
    </header>
  )
}

export function MetaBar() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 border-b border-notion-border px-6 py-2.5 text-[12px] text-notion-text-secondary">
      <span>Last updated <span className="font-medium text-notion-text">{kpis.lastUpdated}</span></span>
      <span>Coverage <span className="font-medium text-notion-blue">{kpis.coverage}%</span></span>
    </div>
  )
}
