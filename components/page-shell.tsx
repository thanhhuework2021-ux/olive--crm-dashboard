import type { ReactNode } from 'react'
import { AppHeader } from '@/components/app-header'

export function PageShell({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader title={title} />
      <main className="flex-1 p-3 md:p-5 lg:p-6">{children}</main>
    </div>
  )
}

export function PageHeading({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h2 className="text-pretty text-xl font-bold tracking-tight md:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
