import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  CUSTOMER_TIER_LABELS,
  type OrderStatus,
  type PaymentStatus,
  type CustomerTier,
  type StockStatus,
} from '@/lib/data'

const orderStatusStyles: Record<OrderStatus, string> = {
  draft: 'bg-muted text-muted-foreground border-transparent',
  pending: 'bg-warning/15 text-warning border-warning/30',
  processing: 'bg-chart-4/15 text-chart-4 border-chart-4/30',
  shipping: 'bg-chart-4/15 text-chart-4 border-chart-4/30',
  completed: 'bg-success/15 text-success border-success/30',
  cancelled: 'bg-destructive/15 text-destructive border-destructive/30',
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', orderStatusStyles[status])}
    >
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  )
}

const paymentStatusStyles: Record<PaymentStatus, string> = {
  paid: 'bg-success/15 text-success border-success/30',
  partial: 'bg-warning/15 text-warning border-warning/30',
  unpaid: 'bg-destructive/15 text-destructive border-destructive/30',
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', paymentStatusStyles[status])}
    >
      {PAYMENT_STATUS_LABELS[status]}
    </Badge>
  )
}

const tierStyles: Record<CustomerTier, string> = {
  new: 'bg-muted text-muted-foreground border-transparent',
  regular: 'bg-primary/15 text-primary border-primary/30',
  vip: 'bg-warning/15 text-warning border-warning/30',
  risk: 'bg-destructive/15 text-destructive border-destructive/30',
}

export function CustomerTierBadge({ tier }: { tier: CustomerTier }) {
  return (
    <Badge variant="outline" className={cn('font-medium', tierStyles[tier])}>
      {CUSTOMER_TIER_LABELS[tier]}
    </Badge>
  )
}

const stockStyles: Record<StockStatus, { label: string; cls: string }> = {
  in_stock: { label: 'Còn hàng', cls: 'bg-success/15 text-success border-success/30' },
  low: { label: 'Sắp hết', cls: 'bg-warning/15 text-warning border-warning/30' },
  out: { label: 'Hết hàng', cls: 'bg-destructive/15 text-destructive border-destructive/30' },
}

export function StockStatusBadge({ status }: { status: StockStatus }) {
  const s = stockStyles[status]
  return (
    <Badge variant="outline" className={cn('font-medium', s.cls)}>
      {s.label}
    </Badge>
  )
}
