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

export async function getLowStockProducts(
  range: string,
  customFrom?: string,
  customTo?: string,
): Promise<LowStockProduct[]> {

  const supabase = await createClient()

  const { from, to } = getDateRange(
    range,
    customFrom,
    customTo
  )

  // Lấy sản phẩm
  const { data: products } = await supabase
    .from("products")
    .select(`
  id,
  name,
  stock_quantity,
  image_url
`)

  // Lấy lịch sử bán
  const { data: items } = await supabase
    .from("order_items")
    .select(`
      product_id,
      quantity,
      orders!inner(
        status,
        created_at
      )
    `)
    .eq("orders.status", "completed")
    .gte("orders.created_at", from.toISOString())
    .lte("orders.created_at", to.toISOString())

  if (!products || !items) return []

  const productMap = new Map(
    products.map(p => [p.id, p])
  )

  const soldMap = new Map<string, number>()

  items.forEach((item: any) => {

    soldMap.set(
      item.product_id,
      (soldMap.get(item.product_id) ?? 0)
      + Number(item.quantity)
    )

  })

  const result: LowStockProduct[] = []

  soldMap.forEach((sold, id) => {

    const product = productMap.get(id)

    if (!product) return

    result.push({
  id,
  name: product.name,
  image: product.image_url,
  stock: Number(product.stock_quantity),
  sold,
})

  })

 const lowStock = result
  .filter(p => p.stock <= 3)
  .sort((a, b) => {

    // Ưu tiên tồn kho thấp nhất
    if (a.stock !== b.stock) {
      return a.stock - b.stock
    }

    // Nếu tồn bằng nhau thì ưu tiên bán nhiều
    return b.sold - a.sold

  })
  .slice(0, 5)

console.table(lowStock)

return lowStock

}

export async function getRecentOrders(
  range: string,
  customFrom?: string,
  customTo?: string,
) {

  const { from, to } = getDateRange(
  range,
  customFrom,
  customTo
)

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
  range: string,
  customFrom?: string,
  customTo?: string,
)
: Promise<RevenueChartItem[]> {

  const supabase = await createClient()

  const { from, to } = getDateRange(
  range,
  customFrom,
  customTo
)

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
  range: string,
  customFrom?: string,
  customTo?: string,
): Promise<DashboardKPI> {



  const supabase = await createClient()


const { from, to } = getDateRange(
  range,
  customFrom,
  customTo
)

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
  range: string,
  customFrom?: string,
  customTo?: string,
): Promise<TopProduct[]> {

  const supabase = await createClient()

  

  const { from, to } = getDateRange(
  range,
  customFrom,
  customTo
)

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
  range: string,
  customFrom?: string,
  customTo?: string,
): Promise<TopCustomer[]> {

  const supabase = await createClient()

  const { from, to } = getDateRange(
  range,
  customFrom,
  customTo
)

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

export async function getOverview(
  range: string
) {

  const supabase = await createClient()
  const { from, to } = getDateRange(
  range,
  customFrom,
  customTo
)


 const { data, error } = await supabase
  .from('orders')
  .select(`
    id,
    customer_id,
    total_amount,
    status,
    created_at
  `)
  .gte('created_at', from.toISOString())
.lte('created_at', to.toISOString())

  if (error || !data) {
  return null
}

const revenue = data
  .filter(order => order.status === 'completed')
  .reduce(
    (sum, order) => sum + Number(order.total_amount),
    0
  )

  const totalOrders = data.length

  const customers = new Set(
  data.map(order => order.customer_id)
).size

const processing = data.filter(
  order => order.status === 'processing'
).length

const shipping = data.filter(
  order => order.status === 'shipping'
).length

const completed = data.filter(
  order => order.status === 'completed'
).length

const cancelled = data.filter(
  order => order.status === 'cancelled'
).length

console.log({
  revenue,
  totalOrders,
  customers,
  processing,
  shipping,
  completed,
  cancelled,
})

return {
  revenue,
  totalOrders,
  customers,
  processing,
  shipping,
  completed,
  cancelled,
}

}

export async function getOrderStatusSummary(
  range: string,
  customFrom?: string,
  customTo?: string,
) {
  const supabase = await createClient()

  const { from, to } = getDateRange(
  range,
  customFrom,
  customTo
)

console.log("=== KPI RANGE ===")
console.log({
  range,
  customFrom,
  customTo,
  from: from.toISOString(),
  to: to.toISOString(),
})

  const { data, error } = await supabase
    .from("orders")
    .select("status")
    .gte("created_at", from.toISOString())
    .lte("created_at", to.toISOString())

  if (error || !data) {
    return {
      pending: 0,
      processing: 0,
      shipping: 0,
      completed: 0,
      cancelled: 0,
    }
  }

  return {
    pending: data.filter(o => o.status === "pending").length,
    processing: data.filter(o => o.status === "processing").length,
    shipping: data.filter(o => o.status === "shipping").length,
    completed: data.filter(o => o.status === "completed").length,
    cancelled: data.filter(o => o.status === "cancelled").length,
  }
}