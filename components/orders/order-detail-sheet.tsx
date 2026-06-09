'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from '@/components/status-badges'
import {
  PAYMENT_METHOD_LABELS,
  type Order,
} from '@/lib/data'
import { formatVND, formatDateTime } from '@/lib/format'
import {
  Phone,
  MapPin,
  Truck,
  User,
  Printer,
  Clock,
} from 'lucide-react'

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? 'text-base font-bold text-primary' : 'font-medium'}>
        {value}
      </span>
    </div>
  )
}

export function OrderDetailSheet({
  order,
  open,
  onOpenChange,
}: {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!order) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
  className="w-full p-0 sm:max-w-2xl"
>
        <SheetHeader className="border-b border-border">
          <div className="flex items-center justify-between gap-2">
            <div>
              <SheetTitle className="flex items-center gap-2 font-mono">
                {order.code}
              </SheetTitle>
              <SheetDescription>
                Tạo lúc {formatDateTime(order.createdAt)}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

<div className="p-8">

  {/* KHÁCH HÀNG */}
  <div className="mb-8">

    <p className="text-xs uppercase tracking-widest text-slate-500">
      Khách hàng
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      {order.customers?.full_name || 'Khách lẻ'}
    </h2>

    <p className="mt-1 text-slate-400">
      {order.customers?.phone}
    </p>

  </div>

  <div className="h-px bg-slate-800 mb-8" />

  {/* SẢN PHẨM */}
  <div className="mb-8">

    <p className="mb-3 text-xs uppercase tracking-widest text-slate-500">
      Sản phẩm
    </p>

    {order.order_items?.map((item: any) => (

      <div
        key={item.id}
        className="flex items-start justify-between py-4"
      >

        <div>

          <p className="text-sm font-medium">
  {item.product_name}
</p>

          <p className="mt-1 text-sm text-slate-500">
            {item.quantity} × {Number(item.sale_price).toLocaleString('vi-VN')}đ
          </p>

        </div>

        <div className="text-right">

          <p className="text-lg font-semibold">
            {Number(item.subtotal).toLocaleString('vi-VN')}đ
          </p>

        </div>

      </div>

    ))}

  </div>

  <div className="h-px bg-slate-800 mb-8" />

  {/* THANH TOÁN */}
  <div className="space-y-3">

    <div className="flex justify-between text-slate-400">
      <span>Tạm tính</span>
      <span>
        {Number(order.subtotal).toLocaleString('vi-VN')}đ
      </span>
    </div>

    <div className="flex justify-between text-slate-400">
      <span>Giảm giá</span>
      <span>
        {Number(order.discount).toLocaleString('vi-VN')}đ
      </span>
    </div>

    <div className="flex justify-between text-slate-400">
      <span>Vận chuyển</span>
      <span>
        {Number(order.shipping_fee).toLocaleString('vi-VN')}đ
      </span>
    </div>

    <div className="my-4 h-px bg-slate-800" />

    <div className="flex items-end justify-between">

     <div>

  <p className="text-xs uppercase tracking-widest text-slate-500">
    Tổng cộng
  </p>

  <p className="mt-2 text-2xl font-bold">
    {Number(order.total_amount).toLocaleString('vi-VN')}đ
  </p>

</div>

      <OrderStatusBadge status={order.status} />

    </div>

</div>

</div>

        <div className="flex gap-2 border-t border-border p-4">
          <Button variant="outline" className="flex-1">
            <Printer data-icon="inline-start" /> In đơn
          </Button>
          <Button className="flex-1">Cập nhật trạng thái</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
