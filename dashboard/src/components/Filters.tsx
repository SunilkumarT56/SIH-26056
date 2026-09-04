import { ChevronDown } from 'lucide-react'

const filters = ['Date Range', 'Origin', 'Destination', 'Airline', 'Lead Time', 'Fare Type']

export function Filters() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-medium uppercase tracking-wider text-notion-text-tertiary">
          Filters
        </span>
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-notion-surface px-3 py-1.5 text-[12px] font-medium text-notion-text-secondary ring-1 ring-notion-border transition-all hover:bg-notion-hover hover:text-notion-text"
          >
            {f}
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
        ))}
      </div>
    </div>
  )
}
