import Link from 'next/link'
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
import {
  recentOrders,
  topProducts,
  lowStockProducts,
  topCustomers,
  getStockStatus,
} from '@/lib/data'
import { formatVND, formatNumber } from '@/lib/format'

function initials(name: string) {
  const parts = name.trim().split(' ')
  return (parts[0][0] + (parts[parts.length - 1][0] ?? '')).toUpperCase()
}

export function RecentOrdersWidget() {
  return (
    <Card className="flex flex-col">
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
      <CardContent className="flex flex-col gap-1">
        {recentOrders.map((o) => (
          <Link
            key={o.id}
            href="/don-hang"
            className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-accent"
          >
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {initials(o.customerName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{o.customerName}</p>
              <p className="font-mono text-xs text-muted-foreground">{o.code}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-semibold">{formatVND(o.total)}</span>
              <OrderStatusBadge status={o.status} />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

export function TopProductsWidget() {
  const max = topProducts[0].sold
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
        {topProducts.map((p, i) => (
          <div key={p.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                <span className="truncate font-medium">{p.name}</span>
              </span>
              <span className="shrink-0 text-muted-foreground">
                {formatNumber(p.sold)} đã bán
              </span>
            </div>
            <Progress value={(p.sold / max) * 100} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function LowStockWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PackageX className="size-4 text-warning" />
          Tồn kho thấp
        </CardTitle>
        <CardDescription>Sản phẩm cần nhập thêm</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {lowStockProducts.slice(0, 6).map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-accent"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{p.sku}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{p.stock}</span>
              <StockStatusBadge status={getStockStatus(p)} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function VipCustomersWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="size-4 text-warning" />
          Khách hàng VIP
        </CardTitle>
        <CardDescription>Top khách chi tiêu nhiều nhất</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {topCustomers.map((c) => (
          <Link
            key={c.id}
            href="/khach-hang"
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-accent"
          >
            <Avatar className="size-9">
              <AvatarFallback className="bg-warning/15 text-warning text-xs font-semibold">
                {initials(c.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatNumber(c.totalOrders)} đơn hàng
              </p>
            </div>
            <span className="text-sm font-semibold text-primary">
              {formatVND(c.totalSpent)}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
