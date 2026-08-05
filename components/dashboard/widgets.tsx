import Link from 'next/link'
import Image from "next/image"
import { ArrowRight, Crown, PackageX, TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { OrderStatusBadge } from '@/components/status-badges'
import { StockStatusBadge } from '@/components/status-badges'

import type {
  LowStockProduct,
  TopProduct,
  TopCustomer,
} from '@/lib/types/dashboard'

import { formatVND, formatNumber } from '@/lib/format'

function initials(name: string) {
  const parts = name.trim().split(' ')
  return (parts[0][0] + (parts[parts.length - 1][0] ?? '')).toUpperCase()
}

interface RecentOrder {
  id: string
  order_code: string
  customer_name: string
  total_amount: number
  status: string
}

export function RecentOrdersWidget({
  orders,
}: {
  orders: RecentOrder[]
}) {


  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Đơn hàng mới nhất</CardTitle>
          <CardDescription>Các đơn vừa được tạo gần đây</CardDescription>
        </div>
        
         <Link href="/don-hang">
  <Button variant="ghost" size="sm">
    Xem tất cả
    <ArrowRight data-icon="inline-end" />
  </Button>
</Link>

      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto flex flex-col gap-1">
        {orders.map((o) => (
          <Link
            key={o.id}
            href="/don-hang"
            className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-accent"
          >
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {initials(o.customer_name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{o.customer_name}</p>
              <p className="font-mono text-xs text-muted-foreground">{o.order_code}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-semibold">{formatVND(o.total_amount)}</span>

              <OrderStatusBadge status={o.status} />

            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

export function TopProductsWidget({
  products,
}: {
  products: TopProduct[]
}) {
  const max =
  Math.max(
    ...products.map(p => p.quantity),
    1
  )
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" />
          Sản phẩm bán chạy
        </CardTitle>
        <CardDescription>Theo số lượng bán trong tháng</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {products.map((p, i) => (
          <div key={p.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                <div className="flex flex-col">

  <span className="truncate font-medium">
    {p.name}
  </span>

  <span className="text-xs text-muted-foreground">
    {p.sku}
  </span>

</div>
              </span>
              
<div className="text-right">

  <p className="font-semibold">

    {formatNumber(p.quantity)}

  </p>

  <p className="text-xs text-muted-foreground">

    {formatVND(p.revenue)}

  </p>

</div>

            </div>
            <Progress value={(p.quantity / max) * 100} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function LowStockWidget({
  products,
}: {
  products: LowStockProduct[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PackageX className="size-4 text-warning" />
          📦 Cần nhập hàng
        </CardTitle>

        <CardDescription>
          Ưu tiên nhập các sản phẩm bán tốt
        </CardDescription>
      </CardHeader>

     <CardContent className="space-y-3">

  {products.map((p) => (

    <div
      key={p.id}
      className="rounded-xl border p-3 transition hover:bg-accent/40"
    >

      <div className="flex gap-3">

        <Image
          src={p.image || "/placeholder.png"}
          alt={p.name}
          width={56}
          height={56}
          className="rounded-lg border object-cover"
        />

        <div className="flex-1">

          <p className="line-clamp-2 text-sm font-semibold">

            {p.name}

          </p>

          <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">

            <span>

              🔥 {p.sold} đơn

            </span>

            <span>

              📦 {p.stock} còn

            </span>

          </div>

        </div>

        <div>

          {p.stock === 0 ? (

            <StockStatusBadge status="out" />

          ) : (

            <StockStatusBadge status="low" />

          )}

        </div>

      </div>

      <Progress
        value={Math.min((p.stock / 5) * 100, 100)}
        className="mt-3 h-2"
      />

    </div>

  ))}

</CardContent>

    </Card>
  )
}

export function VipCustomersWidget({
  customers,
}: {
  customers: TopCustomer[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="size-4 text-warning" />
          Khách hàng VIP
        </CardTitle>

        <CardDescription>
          Top khách hàng có doanh thu cao nhất
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {customers.map((c) => (
          <Link
            key={c.id}
            href="/khach-hang"
            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent"
          >
            <Avatar className="size-9">
              <AvatarFallback className="bg-warning/15 text-warning font-semibold">
                {initials(c.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {c.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {formatNumber(c.orders)} đơn hàng
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold text-primary">
                {formatVND(c.revenue)}
              </p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
