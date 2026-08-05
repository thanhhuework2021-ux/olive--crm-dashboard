'use client'

import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'
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

import InvoicePrint from './invoice-print'

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

  const [paymentAmount, setPaymentAmount] =
    useState('')

  const [
    paymentHistory,
    setPaymentHistory,
  ] = useState<any[]>([])



useEffect(() => {

  if (!order?.id) {
    setPaymentHistory([])
    return
  }

  loadPaymentHistory()

}, [order?.id])

const loadPaymentHistory =
  async () => {

    const { data } =
      await supabase
        .from(
          'payment_transactions'
        )
        .select('*')
        .eq(
          'order_id',
          order?.id
        )
        .order(
          'created_at',
          {
            ascending: false,
          }
        )

    setPaymentHistory(
      data || []
    )
  }

  const handleCollectPayment =
  async () => {

    const amount =
      Number(paymentAmount)

    if (!amount || amount <= 0)
      return

    const paid =
      Number(order.paid_amount || 0)
      + amount

    const remaining =
      Math.max(
        0,
        Number(order.total_amount) - paid
      )

    await supabase
      .from('orders')
      .update({
        paid_amount: paid,
        remaining_amount: remaining,
        payment_status:
          remaining === 0
            ? 'paid'
            : 'partial',
      })
      .eq('id', order.id)

    await supabase
      .from('payment_transactions')
      .insert({
        order_id: order.id,
        amount: amount,
        payment_method: 'cash',
        note: `Thu tiền đơn ${order.order_code}`,
      })

    window.location.reload()
}

  const handlePrint = () => {

  const printContents =
    document.getElementById(
      'invoice-print'
    )?.outerHTML

  if (!printContents) return

  const printWindow =
    window.open(
      '',
      '_blank'
    )

  if (!printWindow) return

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">

<title>Invoice</title>

<script src="https://cdn.tailwindcss.com"></script>

<style>

@page{
    size:A4 portrait;
    margin:5mm;
}

html,
body{

    width:210mm;
    margin:0;
    padding:0;

    background:#fff;

    font-family:Arial, Helvetica, sans-serif;

}

#invoice-print{

    width:190mm;

    margin:0 auto;

}

table{

    width:100%;

    border-collapse:collapse;

}

thead{

    display:table-header-group;

}

tr{

    page-break-inside:avoid;

}

td,
th{

    padding-top:4px;
    padding-bottom:4px;

}

</style>


</head>

<body>

${printContents}

<script>

window.onload = () => {

    setTimeout(() => {

        window.print()

    },300)

}

</script>

</body>
</html>
`)

  printWindow.document.close()

}

console.log('ORDER DETAIL SHEET LOADED')

if (!order) return null

console.log('ORDER ITEMS', order.order_items)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>

  <SheetContent
  className="
!w-[420px]
!max-w-[420px]
p-0
overflow-hidden
"
>
  


        <SheetHeader className="border-b border-border">
          <div className="flex items-center justify-between gap-2">
            <div>
              
              <SheetTitle className="text-blue-500 text-2xl">
  THÔNG TIN ĐƠN HÀNG 
</SheetTitle>

              <SheetDescription>
                Tạo lúc {formatDateTime(order.created_at)}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>


      <div className="flex h-[100vh] flex-col">

       <div
  className="
    flex-1
    overflow-y-auto
    p-3
    text-sm
    custom-scroll
  "
>


  <h2 className="mb-1 text-sm font-semibold">
  Thông tin đơn hàng
</h2>

  <div className="rounded-xl border border-slate-800 p-3 mb-3">

  <div className="flex justify-between mb-2">
    <span className="text-slate-400">
      Đã thu
    </span>

    <span className="font-semibold text-green-500">
      {Number(
        order.paid_amount || 0
      ).toLocaleString('vi-VN')}đ
    </span>
  </div>

  <div className="flex justify-between">
    <span className="text-slate-400">
      Còn nợ
    </span>

    <span className="font-semibold text-red-500">
      {Math.max(
        Number(order.total_amount || 0) -
        Number(order.paid_amount || 0),
        0
      ).toLocaleString('vi-VN')}đ
    </span>
  </div>

</div>

<div className="rounded-xl border border-slate-800 p-2.5">

  <div className="mb-3 text-xs uppercase tracking-wider text-slate-500">
    Lịch sử thanh toán
  </div>

  {paymentHistory.length === 0 && (
    <div className="text-sm text-slate-500">
      Chưa có giao dịch
    </div>
  )}

  {paymentHistory.map((p) => (
    <div
      key={p.id}
      className="flex justify-between border-b border-slate-800 py-2"
    >
      <div>
        <div className="text-sm font-medium text-green-400">
          +{Number(
            p.amount
          ).toLocaleString('vi-VN')}đ
        </div>

        <div className="text-xs text-slate-500">
          {formatDateTime(
            p.created_at
          )}
        </div>
      </div>
    </div>
  ))}

</div>

<div className="rounded-xl border border-slate-800 p-2.5">

  <div className="mb-2 text-xs uppercase tracking-wider text-slate-500">
    Thông tin khách hàng
  </div>

  <div className="space-y-2 text-sm">

    <div>
      <span className="text-slate-400">
        Khách hàng:
      </span>
      {' '}
      <span className="font-medium">
        {order.customers?.full_name}
      </span>
    </div>

    <div>
      <span className="text-slate-400">
        SĐT:
      </span>
      {' '}
      {order.customers?.phone}
    </div>

    <div>
      <span className="text-slate-400">
        Địa chỉ:
      </span>
      {' '}
      {order.customers?.address}
    </div>

    <div>
      <span className="text-slate-400">
        Mã đơn:
      </span>
      {' '}
      {order.order_code}
    </div>

   <div>
  <span className="text-slate-400">
    Mã KH:
  </span>
  {' '}
  {order.customers?.customer_display_code}
</div>

  </div>

</div>

  <div className="mt-4">

   {(order.order_items || []).map(
  (item:any) => {

    console.log('ORDER ITEM =>', item)

    return (
        

      <div
        key={item.id}
        className="flex justify-between border-b py-2"
      >
     <div>
  <div className="font-medium">
    {item.product_name || 'Sản phẩm'}
  </div>

  <div className="text-xs text-muted-foreground">
    SL: {item.quantity}
  </div>

  {item.sku && (
    <div className="text-xs text-slate-400">
      SKU: {item.sku}
    </div>
  )}

  {item.color && (
    <div className="text-xs text-slate-400">
      Màu: {item.color}
    </div>
  )}
</div>

        <div>
          {Number(
            item.subtotal
          ).toLocaleString('vi-VN')}đ
        </div>

      </div>

        )
  })
}
  </div>

<div className="mt-3 text-right">

  <div className="text-base font-bold">

           {Number(
        order.total_amount
      ).toLocaleString('vi-VN')}đ
    </div>

  </div>

</div>
</div>

<div className="hidden">
  <InvoicePrint order={order} />
</div>

<div
  className="
    mt-auto
    border-t
    border-border
    bg-slate-950
    p-3
  "
>

  <div className="grid gap-3">

    <Button
      variant="outline"
      onClick={handlePrint}
      className="w-full"
    >
      <Printer className="mr-2 h-4 w-4" />
      In hóa đơn
    </Button>

    <div className="flex gap-2">

  <input
    type="number"
    placeholder="Nhập số tiền thu"
    value={paymentAmount}
    onChange={(e) =>
      setPaymentAmount(
        e.target.value
      )
    }
    className="
      flex-1
      h-10
      rounded-md
      border
      border-slate-700
      bg-slate-900
      px-3
      text-sm
      text-white
    "
  />

  <Button
    onClick={handleCollectPayment}
    className="min-w-[90px]"
  >
    Thu tiền
  </Button>

</div>
  

  </div>

</div>
</SheetContent>
</Sheet>
)
}