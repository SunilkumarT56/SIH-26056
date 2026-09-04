import { Bell, Search } from 'lucide-react'

const nav = ['Dashboard', 'Routes', 'Airlines', 'Quality', 'Alerts', 'Settings'] as const
export type NavId = (typeof nav)[number]

export function TopNav({ active, onChange }: { active: NavId; onChange: (id: NavId) => void }) {
  return (
    <header className="sticky top-0 z-50 bg-notion-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <div className="flex min-w-[140px] items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-notion-green">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M4 14.5 12 5l8 9.5h-5.2L12 11.2 9.2 14.5H4Z" fill="#111" />
              <path d="M8 18h8" stroke="#111" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-[18px] font-semibold tracking-tight text-white">APIx</span>
        </div>

        <nav className="hidden items-center gap-1 rounded-full bg-notion-elevated/80 px-1.5 py-1 ring-1 ring-white/6 md:flex">
          {nav.map((item) => {
            const isActive = item === active
            return (
              <button
                key={item}
                type="button"
                onClick={() => onChange(item)}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  isActive ? 'bg-white text-black' : 'text-white/55 hover:text-white'
                }`}
              >
                {item}
              </button>
            )
          })}
        </nav>

        <div className="flex min-w-[140px] items-center justify-end gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 ring-1 ring-white/10 transition hover:bg-white/5 hover:text-white"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/70 ring-1 ring-white/10 transition hover:bg-white/5 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>
          <div
            className="ml-1 h-9 w-9 rounded-full bg-gradient-to-br from-amber-200 via-orange-400 to-stone-700 ring-2 ring-white/10"
            title="NSO / RBI Analytics"
          />
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto px-5 pb-3 md:hidden">
        {nav.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-medium ${
              item === active ? 'bg-white text-black' : 'bg-notion-elevated text-white/55'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </header>
  )
}
