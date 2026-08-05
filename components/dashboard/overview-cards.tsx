'use client'

import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { formatVND } from '@/lib/format'

interface Props {
  overview: {
    revenue: number
    totalOrders: number
    customers: number
    processing: number
    shipping: number
    completed: number
    cancelled: number
  }
}

function Item({
  icon: Icon,
  label,
  value,
}: {
  icon: any
  label: string
  value: string | number
}) {
  return (
    <Card className="rounded-xl border p-4 shadow-sm">
      <div className="flex items-center gap-3">

        <div className="rounded-lg bg-muted p-3">
          <Icon className="h-5 w-5" />
        </div>

        <div>

          <p className="text-xs text-muted-foreground">
            {label}
          </p>

          <h3 className="mt-1 text-xl font-bold">
            {value}
          </h3>

        </div>

      </div>
    </Card>
  )
}

export function OverviewCards({
  overview,
}: Props) {

  return (

    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">

      <Item
        icon={DollarSign}
        label="Doanh thu"
        value={formatVND(overview.revenue)}
      />

      <Item
        icon={ShoppingCart}
        label="Đơn hàng"
        value={overview.totalOrders}
      />

      <Item
        icon={Users}
        label="Khách hàng"
        value={overview.customers}
      />

      <Item
        icon={Package}
        label="Đang xử lý"
        value={overview.processing}
      />

      <Item
        icon={Truck}
        label="Đang giao"
        value={overview.shipping}
      />

      <Item
        icon={CheckCircle2}
        label="Hoàn thành"
        value={overview.completed}
      />

      <Item
        icon={XCircle}
        label="Đã hủy"
        value={overview.cancelled}
      />

    </div>

  )
}