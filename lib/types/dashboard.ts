export interface RevenueChartItem {
  date: string
  revenue: number
  orders: number
}

export interface DashboardKPI {
  revenue: number
  orders: number
  customers: number
  aov: number

  revenueChange: number
  ordersChange: number
  customersChange: number
  aovChange: number
}

export interface TopProduct {
  id: string
  name: string
  image: string | null
  sku: string | null
  quantity: number
  revenue: number
}

export interface TopCustomer {
  id: string
  name: string
  phone: string | null
  orders: number
  revenue: number
}

export interface LowStockProduct {
  id: string
  name: string
  sku: string
  stock: number
}