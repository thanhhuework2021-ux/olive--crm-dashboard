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
      <SheetContent className="w-full gap-0 p-0 sm:max-w-xl">
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
            <OrderStatusBadge status={order.status} />
          </div>
        </SheetHeader>

        <Tabs defaultValue="info" className="flex min-h-0 flex-1 flex-col">
          <TabsList className="mx-4 mt-3 grid w-auto grid-cols-4">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="items">Sản phẩm</TabsTrigger>
            <TabsTrigger value="payment">Thanh toán</TabsTrigger>
            <TabsTrigger value="history">Lịch sử</TabsTrigger>
          </TabsList>

          <ScrollArea className="min-h-0 flex-1">
            <div className="p-4">
              <TabsContent value="info" className="mt-0 flex flex-col gap-4">
                <div className="rounded-xl border border-border p-4">
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <User className="size-4 text-primary" /> Khách hàng
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {order.customerName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="size-3" /> {order.customerPhone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Truck className="size-4 text-primary" /> Giao hàng
                  </p>
                  <div className="flex flex-col gap-2">
                    <Row label="Đơn vị vận chuyển" value={order.shippingCarrier ?? '—'} />
                    <Row label="Mã vận đơn" value={order.trackingCode ?? '—'} />
                    <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" />
                      <span>{order.shippingAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="mb-3 text-sm font-semibold">Thông tin khác</p>
                  <div className="flex flex-col gap-2">
                    <Row label="Chi nhánh" value={order.branch} />
                    <Row label="Người tạo" value={order.staff} />
                    {order.note && (
                      <div className="mt-1 rounded-lg bg-muted/50 p-2.5 text-sm text-muted-foreground">
                        {order.note}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="items" className="mt-0 flex flex-col gap-2">
                {order.items.map((it) => (
                  <div
                    key={it.productId}
                    className="flex items-center gap-3 rounded-xl border border-border p-3"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.image} alt={it.name} className="size-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{it.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{it.sku}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">
                        {it.quantity} × {formatVND(it.price)}
                      </p>
                      <p className="font-semibold">
                        {formatVND(it.price * it.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="payment" className="mt-0">
                <div className="rounded-xl border border-border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold">Trạng thái thanh toán</span>
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </div>
                  <Separator className="mb-3" />
                  <div className="flex flex-col gap-2.5">
                    <Row label="Tạm tính" value={formatVND(order.subtotal)} />
                    <Row label="Giảm giá" value={`- ${formatVND(order.discount)}`} />
                    <Row label="VAT (8%)" value={formatVND(order.vat)} />
                    <Row label="Phí vận chuyển" value={formatVND(order.shippingFee)} />
                    <Separator />
                    <Row label="Tổng thanh toán" value={formatVND(order.total)} strong />
                    <Row label="Đã thanh toán" value={formatVND(order.paid)} />
                    <Row label="Còn lại" value={formatVND(order.total - order.paid)} />
                    <Separator />
                    <Row
                      label="Phương thức"
                      value={PAYMENT_METHOD_LABELS[order.paymentMethod]}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <div className="relative flex flex-col gap-0 pl-2">
                  {order.history.map((e, i) => (
                    <div key={e.id} className="relative flex gap-3 pb-5 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className="z-10 flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <Clock className="size-3.5" />
                        </div>
                        {i < order.history.length - 1 && (
                          <div className="absolute top-7 h-full w-px bg-border" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <p className="text-sm font-medium">{e.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.staff} · {formatDateTime(e.time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

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
