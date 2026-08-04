import {
  getDashboardKPIs,
  getRevenueChart,
  getTopProducts,
  getTopCustomers,
  getRecentOrders,
  getLowStockProducts,
} from '@/lib/services/dashboard.service'

import { DateFilter } from '@/components/dashboard/date-filter'

import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  RefreshCcw,

} from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'

import { PageShell } from '@/components/page-shell'

import { KpiCard } from '@/components/kpi-card'

import {
  StaggerGrid,
  StaggerItem,
  FadeIn,
} from '@/components/motion'

import {
  RevenueAreaChart,
  OrdersBarChart,
} from '@/components/dashboard/dashboard-charts'

import {
  RecentOrdersWidget,
  TopProductsWidget,
  LowStockWidget,
  VipCustomersWidget,
} from '@/components/dashboard/widgets'

import {
  formatVND,
  formatNumber,
} from '@/lib/format'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    range?: string
    from?: string
    to?: string
  }>
}) {
  const params = await searchParams

  const range = params.range ?? '30d'

  console.log('Current Range:', range)

const [
  kpis,
  revenueData,
  topProducts,
  topCustomers,
  recentOrders,
  lowStock,
] = await Promise.all([
  getDashboardKPIs(range),
  getRevenueChart(range),
  getTopProducts(range),
  getTopCustomers(range),
  getRecentOrders(range),
  getLowStockProducts(),
])

console.log('Revenue Data:', revenueData)

  return (

<PageShell title="Dashboard">

{/* ================= HEADER ================= */}

<div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

<div>

<h1 className="text-3xl font-bold tracking-tight">

Dashboard

</h1>

<p className="mt-2 text-sm text-muted-foreground">

Theo dõi tình hình kinh doanh theo thời gian thực

</p>

</div>

<div className="flex gap-3">

<DateFilter value={range} />

<Button>

<RefreshCcw className="mr-2 h-4 w-4"/>

Làm mới

</Button>

</div>

</div>

{/* ================= KPI ================= */}

<StaggerGrid className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

<StaggerItem>

<KpiCard
  label="Tổng doanh thu"
  value={formatVND(kpis.revenue)}
  change={kpis.revenueChange}
  icon={DollarSign}
/>


</StaggerItem>

<StaggerItem>

<KpiCard

label="Giá trị đơn TB"

value={formatVND(kpis.aov)}

change={kpis.aovChange}

icon={TrendingUp}

/>

</StaggerItem>

<StaggerItem>

<KpiCard

label="Tổng đơn hàng"

value={formatNumber(kpis.orders)}

change={kpis.ordersChange}

icon={ShoppingCart}

/>

</StaggerItem>

<StaggerItem>

<KpiCard

label="Khách hàng"

value={formatNumber(kpis.customers)}

change={kpis.customersChange}

icon={Users}

/>

</StaggerItem>

</StaggerGrid>

{/* ================= REVENUE ================= */}

<div className="mt-8 grid grid-cols-12 gap-5 items-stretch">

  <FadeIn
    delay={0.1}
    className="col-span-12 xl:col-span-8"
  >
    <Card className="h-full rounded-2xl border shadow-sm flex flex-col">

      <CardHeader className="pb-3">

        <CardTitle>
          Doanh Thu
        </CardTitle>

        <CardDescription>
          Doanh thu và số lượng đơn hàng theo từng ngày
        </CardDescription>

      </CardHeader>

      <CardContent className="flex-1 pt-0">

        <RevenueAreaChart
          data={revenueData}
        />

      </CardContent>

    </Card>
  </FadeIn>

  <FadeIn
    delay={0.2}
    className="col-span-12 xl:col-span-4"
  >

    <RecentOrdersWidget
  orders={recentOrders}
/>

  </FadeIn>

</div>

{/* ================= ORDERS ================= */}

<div className="mt-6">

  <Card className="h-full rounded-2xl border shadow-sm flex flex-col">

    <CardHeader className="pb-3">

      <CardTitle>

        Đơn hàng theo ngày

      </CardTitle>

      <CardDescription>

        Biến động số lượng đơn hàng trong 30 ngày gần nhất

      </CardDescription>

    </CardHeader>

    <CardContent className="flex-1 pt-0">

      <OrdersBarChart
        data={revenueData}
      />

    </CardContent>

  </Card>

</div>

{/* ================= WIDGETS ================= */}

<div className="mt-8 grid grid-cols-12 gap-5 items-stretch">

  {/* TOP PRODUCTS */}

  <FadeIn
    delay={0.3}
    className="col-span-12 lg:col-span-4"
  >
    <TopProductsWidget
      products={topProducts}
    />
  </FadeIn>

  {/* VIP CUSTOMER */}

  <FadeIn
    delay={0.35}
    className="col-span-12 lg:col-span-4"
  >
    <VipCustomersWidget
      customers={topCustomers}
    />
  </FadeIn>

  {/* LOW STOCK */}

  <FadeIn
    delay={0.4}
    className="col-span-12 lg:col-span-4"
  >
    <LowStockWidget
  products={lowStock}
/>
  </FadeIn>

</div>

{/* ================= FOOTER ================= */}

<div className="mt-8 border-t pt-6">

  <div className="flex items-center justify-between">

    <div>

      <h3 className="text-sm font-semibold">
        OLIVE CRM Dashboard
      </h3>

      <p className="mt-1 text-xs text-muted-foreground">
        Dữ liệu được đồng bộ trực tiếp từ Supabase.
      </p>

    </div>

    <div className="text-right">

      <p className="text-xs text-muted-foreground">
        Phiên bản
      </p>

      <p className="font-semibold">
        v1.0.0
      </p>

    </div>

  </div>

</div>

</PageShell>

)
}