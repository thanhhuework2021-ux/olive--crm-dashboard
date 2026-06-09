'use client'
import { Switch } from '@/components/ui/switch'
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
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from '@/components/status-badges'
import { OrderDetailSheet } from '@/components/orders/order-detail-sheet'

import {
  ORDER_STATUS_LABELS,
  branches,
  staffList,
  type OrderStatus,
} from '@/lib/data'

import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'
import { formatVND, formatDateTime } from '@/lib/format'

export function OrdersListClient() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [branch, setBranch] = useState<string>('all')
  const [staff, setStaff] = useState<string>('all')
  const [selected, setSelected] = useState<any>(null)

  const [orders, setOrders] =
  useState<any[]>([])
  const [open, setOpen] = useState(false)
  useEffect(() => {
  loadOrders()
}, [])

const loadOrders = async () => {

  const { data, error } =
    await supabase
      .from('orders')
.select(`
  *,
  customers (
    full_name,
    phone
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
    if (status !== 'all' && o.status !== status) return false

    if (
      query &&
      !String(o.order_code || '')
        .toLowerCase()
        .includes(query.toLowerCase())
    )
      return false

    return true
  })
}, [orders, query, status])

  const openOrder = (o: Order) => {
    setSelected(o)
    setOpen(true)
  }

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
            <div className="flex flex-wrap gap-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="size-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {ORDER_STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Chi nhánh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.name}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={staff} onValueChange={setStaff}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Nhân viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tất cả nhân viên</SelectItem>
                    {staffList.slice(2).map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name}
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
                <TableRow className="hover:bg-transparent">
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead className="text-right">Tổng tiền</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="hidden md:table-cell">Ngày tạo</TableHead>
                  <TableHead className="hidden lg:table-cell">Người tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
  <TableRow
    key={o.id}
    onClick={() => openOrder(o)}
    className="cursor-pointer"
  >
                    <TableCell className="font-mono text-sm font-medium text-primary">
                      {o.order_code}
                    </TableCell>
                    
                     <TableCell>
  <div className="flex items-center gap-2.5">
    <Avatar className="size-8">
      <AvatarFallback className="bg-muted text-xs">
        {(o.customers?.full_name || 'K')
          .charAt(0)
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>

    <div>
      <p className="font-medium">
        {o.customers?.full_name || 'Khách lẻ'}
      </p>

      <p className="text-xs text-muted-foreground">
        {o.customers?.phone || ''}
      </p>
    </div>
  </div>
</TableCell>

                    <TableCell className="text-right font-semibold">
                      {formatVND(o.total_amount)}
                    </TableCell>
                    
                      <TableCell>
  <Switch
    checked={o.payment_status === 'paid'}
    onCheckedChange={async (checked) => {
      const newStatus = checked ? 'paid' : 'unpaid'

      await supabase
        .from('orders')
        .update({
          payment_status: newStatus,
          status: checked
            ? 'confirmed'
            : 'pending',
        })
        .eq('id', o.id)

      loadOrders()
    }}
  />
</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={o.status} />
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {formatDateTime(o.created_at)}
                    </TableCell>
                    <TableCell className="hidden text-sm lg:table-cell">
                      {o.staff}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
