import { createClient } from '@/lib/supabase/server'
import type {
  RevenueChartItem,
  DashboardKPI,
  TopProduct,
  TopCustomer,
} from '@/lib/types/dashboard'

import { getDateRange } from '@/lib/utils/date-range'

import type {
  LowStockProduct,
} from "@/lib/types/dashboard"

export async function getLowStockProducts(): Promise<LowStockProduct[]> {

  const supabase = await createClient()

  const { data, error } = await supabase

    .from('products')
    .select(`
      id,
      name,
      sku,
      stock_quantity
    `)
    .eq('status', 'active')
    .lte('stock_quantity', 10)
    .order('stock_quantity', {
      ascending: true,
    })
    .limit(10)

  if (error || !data) return []

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    sku: item.sku,
    stock: Number(item.stock_quantity),
  }))
}


export async function getRecentOrders(
  range: string
) {

  const { from, to } = getDateRange(range)

  const supabase = await createClient()

  const { data, error } = await supabase
  .from('orders')
.select(`
  id,
  order_code,
  customer_name,
  total_amount,
  status,
  created_at
`)
.gte('created_at', from.toISOString())
.lte('created_at', to.toISOString())
.order('created_at', { ascending: false })
.limit(5)

  if (error || !data) return []

  return data
}

export async function getRevenueChart(
  range: string
): Promise<RevenueChartItem[]> {

  const supabase = await createClient()

  const { from, to } = getDateRange(range)

  const { data, error } = await supabase
  .from('orders')
  .select(`
    created_at,
    total_amount,
    status
  `)
  .eq('status', 'completed')
  .gte('created_at', from.toISOString())
  .lte('created_at', to.toISOString())
  .order('created_at', {
    ascending: true,
  })

  if (error || !data) return []

  const map = new Map<string, RevenueChartItem>()

  data.forEach((order) => {
    const date = new Date(order.created_at).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    })

    if (!map.has(date)) {
      map.set(date, {
        date,
        revenue: 0,
        orders: 0,
      })
    }

    const item = map.get(date)!

    item.revenue += Number(order.total_amount || 0)
    item.orders += 1
  })

  return [...map.values()]
}

function percentChange(
  current: number,
  previous: number
) {
  if (previous === 0) return 0

  return ((current - previous) / previous) * 100
}

export async function getDashboardKPIs(
  range: string
): Promise<DashboardKPI> {



  const supabase = await createClient()


const { from, to } = getDateRange(range)

const diff = to.getTime() - from.getTime()

const previousFrom = new Date(
  from.getTime() - diff - 1
)

const previousTo = new Date(
  from.getTime() - 1
)

 const { data: orders, error } = await supabase
  .from('orders')
  .select(`
    customer_id,
    total_amount,
    created_at,
    status
  `)
  .eq('status', 'completed')
  .gte('created_at', from.toISOString())
  .lte('created_at', to.toISOString())

const { data: previousOrders } = await supabase
  .from('orders')
  .select(`
    customer_id,
    total_amount,
    created_at,
    status
  `)
  .eq('status', 'completed')
  .gte('created_at', previousFrom.toISOString())
  .lte('created_at', previousTo.toISOString())



  

 if (error || !orders) {
  return {
    revenue: 0,
    orders: 0,
    customers: 0,
    aov: 0,

    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
    aovChange: 0,
  }
}

  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.total_amount),
    0
  )

  const totalOrders = orders.length

  const previousOrdersCount =
  previousOrders?.length ?? 0

  const uniqueCustomers = new Set(
  orders.map(order => order.customer_id)
)

const customerCount = uniqueCustomers.size



const previousRevenue =
  previousOrders?.reduce(
    (sum, order) => sum + Number(order.total_amount),
    0
  ) ?? 0


const previousCustomers = new Set(
  previousOrders?.map(o => o.customer_id)
).size

const aov =
  totalOrders > 0
    ? revenue / totalOrders
    : 0

const previousAov =
  previousOrdersCount > 0
    ? previousRevenue / previousOrdersCount
    : 0

console.log({
  revenue,
  previousRevenue,

  totalOrders,
  previousOrdersCount,

  customerCount,
  previousCustomers,

  aov,
  previousAov,

  revenueChange: percentChange(
    revenue,
    previousRevenue
  ),

  ordersChange: percentChange(
    totalOrders,
    previousOrdersCount
  ),

  customersChange: percentChange(
    customerCount,
    previousCustomers
  ),

  aovChange: percentChange(
    aov,
    previousAov
  ),
})

return {
  revenue,
  orders: totalOrders,
  customers: customerCount,
  aov:
    totalOrders > 0
      ? revenue / totalOrders
      : 0,

  revenueChange: percentChange(
    revenue,
    previousRevenue
  ),

  ordersChange: percentChange(
    totalOrders,
    previousOrdersCount
  ),

  customersChange: percentChange(
    customerCount,
    previousCustomers
  ),

  aovChange: percentChange(
    totalOrders > 0
      ? revenue / totalOrders
      : 0,
    previousAov
  ),
}

}

export async function getTopProducts(
  range: string
): Promise<TopProduct[]> {

  const supabase = await createClient()

  

  const { from, to } = getDateRange(range)

  const { data, error } = await supabase
    .from('order_items')
    .select(`
      product_id,
      product_name,
      sku,
      quantity,
      subtotal,
      products (
        image_url
      ),
      orders!inner (
        status,
        created_at
      )
    `)
    .eq('orders.status', 'completed')
    .gte('orders.created_at', from.toISOString())
    .lte('orders.created_at', to.toISOString())


  if (error || !data) return []

  const map = new Map<string, TopProduct>()

  data.forEach((item: any) => {
    const id = item.product_id

    if (!map.has(id)) {
      map.set(id, {
        id,
        name: item.product_name,
        sku: item.sku,
        image: item.products?.image_url ?? null,
        quantity: 0,
        revenue: 0,
      })
    }

    const p = map.get(id)!

    p.quantity += Number(item.quantity || 0)
    p.revenue += Number(item.subtotal || 0)
  })

  return [...map.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
}

export async function getTopCustomers(
  range: string
): Promise<TopCustomer[]> {

  const supabase = await createClient()

  const { from, to } = getDateRange(range)

  const { data, error } = await supabase
    .from('orders')
    .select(`
      customer_id,
      customer_name,
      total_amount,
      customers (
        phone
      )
    `)
    .eq('status', 'completed')
    .gte('created_at', from.toISOString())
    .lte('created_at', to.toISOString())



  if (error || !data) return []

  const map = new Map<string, TopCustomer>()

  data.forEach((order: any) => {
    const id = order.customer_id

    if (!map.has(id)) {
      map.set(id, {
        id,
        name: order.customer_name,
        phone: order.customers?.phone ?? null,
        orders: 0,
        revenue: 0,
      })
    }

    const customer = map.get(id)!

    customer.orders += 1
    customer.revenue += Number(order.total_amount || 0)
  })

  return [...map.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
}

