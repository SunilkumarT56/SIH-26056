import { Card } from './Card'
import { kpis } from '../data/mockData'

const endpoints = ['/index', '/routes', '/fares', '/weights', '/metadata', '/validation']

export function GovAPI() {
  return (
    <Card title="Government Data Access">
      <div className="flex flex-wrap items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-2 text-[13px]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-notion-green opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-notion-green" />
          </span>
          <span className="text-notion-text-secondary">
            API <span className="font-medium text-notion-green">Operational</span>
          </span>
        </div>
        <span className="hidden h-4 w-px bg-notion-border sm:block" />
        <span className="text-[13px] text-notion-text-secondary">
          Latest APIx <span className="font-semibold text-notion-text">{kpis.index}</span>
        </span>
        <span className="hidden h-4 w-px bg-notion-border sm:block" />
        <span className="text-[13px] text-notion-text-secondary">
          Coverage <span className="font-semibold text-notion-blue">{kpis.coverage}%</span>
        </span>
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {endpoints.map((ep) => (
          <code
            key={ep}
            className="cursor-default rounded-md bg-notion-surface px-3 py-1.5 text-[12px] font-medium text-notion-blue ring-1 ring-notion-border transition-colors hover:bg-notion-hover hover:ring-notion-border-strong"
          >
            {ep}
          </code>
        ))}
      </div>
    </Card>
  )
}
