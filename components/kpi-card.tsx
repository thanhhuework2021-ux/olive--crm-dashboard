import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatPercent } from '@/lib/format'

export function KpiCard({
  label,
  value,
  change,
  icon: Icon,
  invertColor = false,
}: {
  label: string
  value: string
  change: number
  icon: LucideIcon
  invertColor?: boolean
}) {
  const positive = invertColor ? change < 0 : change > 0
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-4.5" />
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium',
                positive
                  ? 'bg-success/15 text-success'
                  : 'bg-destructive/15 text-destructive',
              )}
            >
              {change > 0 ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              {formatPercent(change)}
            </span>
            <span className="text-xs text-muted-foreground">so với kỳ trước</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
