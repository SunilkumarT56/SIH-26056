import type { ReactNode } from 'react'

interface CardProps {
  title: string
  children: ReactNode
  className?: string
  action?: ReactNode
}

export function Card({ title, children, className = '', action }: CardProps) {
  return (
    <section className={`rounded-[28px] bg-notion-card ring-1 ring-white/6 ${className}`}>
      <div className="flex items-center justify-between px-6 py-5">
        <h3 className="text-[16px] font-medium text-white">{title}</h3>
        {action}
      </div>
      <div className="px-6 pb-6">{children}</div>
    </section>
  )
}
