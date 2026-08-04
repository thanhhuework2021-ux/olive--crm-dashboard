'use client'
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, Download } from 'lucide-react'
import { PageShell, PageHeading } from '@/components/page-shell'
import { FadeIn } from '@/components/motion'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'

import { OrderDetailSheet } from '@/components/orders/order-detail-sheet'

import {
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from '@/lib/data'

import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'
import { formatVND, formatDateTime } from '@/lib/format'


export function OrdersListClient() {

  const router = useRouter()
  
const [query, setQuery] = useState('')
const [status, setStatus] = useState<string>('all')

const [fromDate, setFromDate] =
  useState('')

const [toDate, setToDate] =
  useState('')

const [paymentFilter, setPaymentFilter] =
  useState('all')

const [selected, setSelected] =
  useState<any>(null)

  const [orders, setOrders] =
  useState<any[]>([])
  const [open, setOpen] = useState(false)
  useEffect(() => {
  loadOrders()
}, [])

const [currentPage, setCurrentPage] =
  useState(1)

const ITEMS_PER_PAGE = 10

const loadOrders = async () => {

const { data, error } =
  await supabase
    .from('orders')
    .select(`
      *,
      customers (
  customer_code,
  customer_display_code,
  full_name,
  phone,
  address
      ),
      order_items (
        *
      )
    `)
      .order(
        'created_at',
        { ascending: false }
      )

  if (error) {
    console.log(error)
    return
  }
console.log(data?.[0])

  setOrders(data || [])
}

  const filtered = useMemo(() => {


  return orders.filter((o) => {

    if (
      status !== 'all' &&
      o.status !== status
    ) {
      return false
    }

    if (
      paymentFilter !== 'all' &&
      o.payment_status !== paymentFilter
    ) {
      return false
    }

    if (
      query &&
      !(
        String(
          o.order_code || ''
        )
          .toLowerCase()
          .includes(
            query.toLowerCase()
          ) ||

        String(
          o.customers?.full_name || ''
        )
          .toLowerCase()
          .includes(
            query.toLowerCase()
          )
      )
    ) {
      return false
    }

  if (fromDate) {

  const orderDate = new Date(o.created_at)

  const startDate = new Date(fromDate)
  startDate.setHours(0, 0, 0, 0)

  if (orderDate.getTime() < startDate.getTime()) {
    return false
  }

}

if (toDate) {

  const orderDate = new Date(o.created_at)

  const endDate = new Date(toDate)
  endDate.setHours(23, 59, 59, 999)

  if (orderDate.getTime() > endDate.getTime()) {
    return false
  }

}

    return true

  })

}, [
  orders,
  query,
  status,
  paymentFilter,
  fromDate,
  toDate,
])

const activeOrders = filtered.filter(
  (o) => o.status !== 'cancelled'
)

  const totalPages = Math.ceil(
  filtered.length /
    ITEMS_PER_PAGE
)

const paginatedOrders =
  filtered.slice(
    (currentPage - 1) *
      ITEMS_PER_PAGE,
    currentPage *
      ITEMS_PER_PAGE
  )

  const openOrder = (o: any) => {
    setSelected(o)
    setOpen(true)
  }

const duplicateOrder = (order: any) => {

  router.push(
    `/don-hang/tao-moi?mode=duplicate&id=${order.id}`
  )

}

  const totalRevenue =
  filtered.reduce(
    (sum, o) =>
      sum + Number(o.total_amount || 0),
    0
  )

const paidRevenue =
  filtered
    .filter(
      (o) =>
        o.payment_status === 'paid'
    )
    .reduce(
      (sum, o) =>
        sum +
        Number(o.total_amount || 0),
      0
    )

const unpaidRevenue =
  filtered
    .filter(
      (o) =>
        o.payment_status !== 'paid'
    )
    .reduce(
      (sum, o) =>
        sum +
        Number(o.total_amount || 0),
      0
    )

  return (
    <PageShell title="Danh sách đơn hàng">
      <PageHeading
        title="Đơn hàng"
        description={`Quản lý toàn bộ ${orders.length} đơn hàng của doanh nghiệp`}
        actions={
          <>

          
            <Button variant="outline">
              <Download data-icon="inline-start" /> Xuất Excel
            </Button>
            
            <Link href="/don-hang/tao-moi">
  <Button>
    <Plus data-icon="inline-start" />
    Tạo đơn hàng
  </Button>
</Link>

          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">

  <Card>
    <CardContent className="p-5">
      <p className="text-sm text-slate-400">
        Tổng đơn
      </p>

      <h2 className="mt-2 text-3xl font-bold">
  {activeOrders.length}
</h2>

    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-5">
      <p className="text-sm text-slate-400">
        Tổng giá trị
      </p>
      <h2 className="mt-2 text-3xl font-bold">

       {formatVND(
  activeOrders.reduce(
    (sum, o) =>
      sum + Number(o.total_amount || 0),
    0
  )
)}

      </h2>

    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-5">
      <p className="text-sm text-green-400">
        Đã thu
      </p>

      <h2 className="mt-2 text-3xl font-bold text-green-400">
       
    {formatVND(
  activeOrders.reduce(
    (sum, o) =>
      sum +
      Number(o.paid_amount || 0),
    0
  )
)}

      </h2>

    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-5">
      <p className="text-sm text-red-400">
        Công nợ
      </p>
      <h2 className="mt-2 text-3xl font-bold text-red-400">

        {formatVND(
  activeOrders.reduce(
    (sum, o) =>
      sum +
      Number(o.remaining_amount || 0),
    0
  )
)}

      </h2>

    </CardContent>
  </Card>

</div>

      <FadeIn>
        <Card className="mb-4">
          <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã đơn hoặc tên khách..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
           <div className="relative">


  <input
  type="date"
  value={fromDate}
  onChange={(e) =>
    setFromDate(e.target.value)
  }
  onClick={(e) => {
    e.currentTarget.showPicker?.()
  }}
    
    className="
      h-8
      w-[170px]
      rounded-lg
      border
      border-slate-700
      bg-slate-1000
      pl-10
      pr-3
      
    "
  />

</div>

<div className="relative">


  <input
    type="date"
    value={toDate}
    onChange={(e) =>
      setToDate(e.target.value)
    }
    className="
      h-8
      w-[170px]
      rounded-lg
      border
      border-slate-700
      bg-slate-1000
      pl-10
      pr-3
      
    "
  />

</div>


          <div className="flex flex-wrap gap-2">
  <Select value={status} onValueChange={setStatus}>


    <Select
  value={paymentFilter}
  onValueChange={
    setPaymentFilter
  }
>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Thanh toán" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="all">
      Tất cả thanh toán
    </SelectItem>

    <SelectItem value="paid">
      Đã thanh toán
    </SelectItem>

    <SelectItem value="unpaid">
      Chưa thanh toán
    </SelectItem>
  </SelectContent>
</Select>

    <SelectTrigger className="w-[160px]">
      <Filter className="size-3.5 text-muted-foreground" />
      <SelectValue placeholder="Trạng thái" />
    </SelectTrigger>

    <SelectContent>
      <SelectGroup>
        <SelectItem value="all">
          Tất cả trạng thái
        </SelectItem>

        {(Object.keys(
          ORDER_STATUS_LABELS
        ) as OrderStatus[]).map((s) => (
          <SelectItem
            key={s}
            value={s}
          >
            {ORDER_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
</div>

          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Card className="overflow-hidden">
          <CardContent className="p-0">

            <Table>

              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>
  SP
</TableHead>
                  <TableHead className="text-right">
                    Tổng tiền
                  </TableHead>
                  <TableHead>
                    Thanh toán
                  </TableHead>
                  <TableHead>
                    Trạng thái
                  </TableHead>
                  <TableHead>
                    Ngày tạo
                  </TableHead>
                  <TableHead>
  Hóa đơn
</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>

                {paginatedOrders.map((o) => (

                  <TableRow
                    key={o.id}
                    onClick={() =>
                      openOrder(o)
                    }
                    className="cursor-pointer"
                  >

                    <TableCell className="font-mono">
                      {o.order_code}
                    </TableCell>

                    <TableCell>
                      {o.customers?.full_name ||
                        'Khách lẻ'}
                    </TableCell>

                    <TableCell>
  {o.order_items?.length || 0} SP
</TableCell>

                    <TableCell className="text-right font-semibold">
                      {formatVND(
                        o.total_amount
                      )}
                    </TableCell>

                    <TableCell>

  <div className="space-y-1">

    <div className="text-xs text-green-500 font-medium">
      <div className="space-y-1">

  <div className="text-xs font-medium text-green-500">
    Thu:
    {' '}
    {formatVND(
      Number(
        o.paid_amount || 0
      )
    )}
  </div>

 <div className="text-xs font-medium text-red-500">
  Nợ:
  {' '}
  {formatVND(
    Math.max(
      Number(o.total_amount || 0) -
      Number(o.paid_amount || 0),
      0
    )
  )}
</div>

</div>
    </div>

  </div>

</TableCell>

                    <TableCell
  onClick={(e) =>
    e.stopPropagation()
  }
>

<Select
  value={o.status}
  onValueChange={async (
    value
  ) => {

    if (
      value === 'cancelled' &&
      o.status !== 'cancelled'
    ) {

      for (const item of (
        o.order_items || []
      )) {

        const {
          data: product,
        } = await supabase
          .from('products')
          .select('*')
          .eq(
            'id',
            item.product_id
          )
          .single()

        if (!product)
          continue

        await supabase
          .from('products')
          .update({
            stock_quantity:
              product.stock_quantity +
              item.quantity,
          })
          .eq(
            'id',
            item.product_id
          )

        await supabase
          .from(
            'inventory_transactions'
          )
          .insert({
            product_id:
              item.product_id,
            sku: item.sku,
            transaction_type:
              'RETURN',
            quantity:
              item.quantity,
            stock_after:
              product.stock_quantity +
              item.quantity,
            reference_type:
              'ORDER_CANCEL',
            reference_id:
              o.order_code,
            created_by:
              'ADMIN',
            note:
              `Hủy đơn ${o.order_code}`,
          })
      }
    }

    await supabase
      .from('orders')
      .update({
        status: value,
      })
      .eq('id', o.id)

    loadOrders()
  }}
>

  <SelectTrigger
    className="
      h-8
      w-[150px]
      border-0
      bg-slate-800
    "
  >

    <span className="text-sm font-medium">

  {o.status === 'pending' &&
    '🟡 Chờ xác nhận'}

  {o.status === 'processing' &&
    '🔵 Đang xử lý'}

  {o.status === 'shipping' &&
    '🟣 Đang giao'}

  {o.status === 'completed' &&
    '🟢 Hoàn thành'}

  {o.status === 'cancelled' &&
    '🔴 Đã hủy'}

</span>

  </SelectTrigger>

  <SelectContent>

    <SelectItem
      value="pending"
    >
      🟡 Chờ xác nhận
    </SelectItem>

    <SelectItem
      value="processing"
    >
      🔵 Đang xử lý
    </SelectItem>

    <SelectItem
      value="shipping"
    >
      🟣 Đang giao
    </SelectItem>

    <SelectItem
      value="completed"
    >
      🟢 Hoàn thành
    </SelectItem>

    <SelectItem
      value="cancelled"
    >
      🔴 Đã hủy
    </SelectItem>

  </SelectContent>

</Select>

</TableCell>

                    <TableCell>
                      {formatDateTime(
                        o.created_at
                      )}
                    </TableCell>

                   <TableCell
  onClick={(e)=>e.stopPropagation()}
>

<div className="flex items-center gap-2">

<button
onClick={()=>openOrder(o)}
className="
rounded-lg
px-3
py-1.5
text-cyan-400
hover:bg-cyan-500/10
"
>
👁 Xem
</button>

<button
onClick={()=>duplicateOrder(o)}
className="
rounded-lg
px-3
py-1.5
text-yellow-400
hover:bg-yellow-500/10
"
>
📄 Copy
</button>

</div>

</TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>
            <div className="flex items-center justify-center gap-2 border-t p-4">

  <Button
    variant="outline"
    disabled={currentPage === 1}
    onClick={() =>
      setCurrentPage(
        currentPage - 1
      )
    }
  >
    ←
  </Button>

  {Array.from(
    {
      length: totalPages,
    },
    (_, i) => (
      <Button
        key={i}
        variant={
          currentPage ===
          i + 1
            ? 'default'
            : 'outline'
        }
        onClick={() =>
          setCurrentPage(
            i + 1
          )
        }
      >
        {i + 1}
      </Button>
    )
  )}

  <Button
    variant="outline"
    disabled={
      currentPage ===
      totalPages
    }
    onClick={() =>
      setCurrentPage(
        currentPage + 1
      )
    }
  >
    →
  </Button>

</div>

          
            {filtered.length === 0 && (
              <Empty className="py-16">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Search />
                  </EmptyMedia>
                  <EmptyTitle>Không tìm thấy đơn hàng</EmptyTitle>
                  <EmptyDescription>
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {<OrderDetailSheet
  order={selected}
  open={open}
  onOpenChange={setOpen}
/>}
    </PageShell>
  )
}
