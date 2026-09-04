import { AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { Card } from './Card'
import { alerts } from '../data/mockData'

const config = {
  high: {
    icon: AlertCircle,
    border: 'border-l-notion-red',
    bg: 'bg-notion-red/5',
    tag: 'text-notion-red bg-notion-red/10 ring-notion-red/20',
  },
  medium: {
    icon: AlertTriangle,
    border: 'border-l-notion-orange',
    bg: 'bg-notion-orange/5',
    tag: 'text-notion-orange bg-notion-orange/10 ring-notion-orange/20',
  },
  info: {
    icon: Info,
    border: 'border-l-notion-blue',
    bg: 'bg-notion-blue/5',
    tag: 'text-notion-blue bg-notion-blue/10 ring-notion-blue/20',
  },
}

export function AlertsPanel() {
  return (
    <Card title="Policy Alerts / Anomalies">
      <div className="space-y-2.5">
        {alerts.map((a) => {
          const c = config[a.severity]
          const Icon = c.icon
          return (
            <div
              key={a.route}
              className={`flex gap-3 rounded-lg border border-notion-border border-l-[3px] ${c.border} ${c.bg} px-4 py-3.5 transition-colors hover:bg-notion-hover/30`}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${c.tag}`}>
                    {a.severity}
                  </span>
                  <span className="text-[13px] font-medium text-notion-text">{a.route}</span>
                </div>
                <p className="mt-1 text-[13px] text-notion-text-secondary">{a.message}</p>
                <p className="mt-0.5 text-[12px] italic text-notion-text-tertiary">{a.note}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
