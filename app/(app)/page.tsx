import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  UserPlus,
  Boxes,
  Wallet,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PageShell, PageHeading } from '@/components/page-shell'
import { KpiCard } from '@/components/kpi-card'
import { StaggerGrid, StaggerItem, FadeIn } from '@/components/motion'
import {
  RevenueAreaChart,
  OrdersBarChart,
  BranchBarChart,
} from '@/components/dashboard/dashboard-charts'
import {
  RecentOrdersWidget,
  TopProductsWidget,
  LowStockWidget,
  VipCustomersWidget,
} from '@/components/dashboard/widgets'
import { kpis } from '@/lib/data'
import { formatVND, formatNumber } from '@/lib/format'

export default function Home() {
  return <div>CRM Dashboard Loading...</div>
}

export default function DashboardPage() {
  return (
    <PageShell title="Tổng quan">
      <PageHeading
        title="Chào buổi sáng, anh An 👋"
        description="Đây là tình hình kinh doanh của bạn hôm nay, 07/06/2026."
      />

      <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StaggerItem>
          <KpiCard label="Doanh thu hôm nay" value={formatVND(kpis.revenueToday)} change={kpis.revenueTodayChange} icon={DollarSign} />
        </StaggerItem>
        <StaggerItem>
          <KpiCard label="Doanh thu tháng" value={formatVND(kpis.revenueMonth)} change={kpis.revenueMonthChange} icon={TrendingUp} />
        </StaggerItem>
        <StaggerItem>
          <KpiCard label="Tổng đơn hàng" value={formatNumber(kpis.totalOrders)} change={kpis.totalOrdersChange} icon={ShoppingCart} />
        </StaggerItem>
        <StaggerItem>
          <KpiCard label="Khách hàng mới" value={formatNumber(kpis.newCustomers)} change={kpis.newCustomersChange} icon={UserPlus} />
        </StaggerItem>
        <StaggerItem>
          <KpiCard label="Giá trị tồn kho" value={formatVND(kpis.inventoryValue)} change={kpis.inventoryValueChange} icon={Boxes} invertColor />
        </StaggerItem>
        <StaggerItem>
          <KpiCard label="Công nợ cần thu" value={formatVND(kpis.receivable)} change={kpis.receivableChange} icon={Wallet} invertColor />
        </StaggerItem>
      </StaggerGrid>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <FadeIn delay={0.1} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu 30 ngày</CardTitle>
              <CardDescription>Biến động doanh thu theo ngày</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueAreaChart />
            </CardContent>
          </Card>
        </FadeIn>
        <FadeIn delay={0.15}>
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo chi nhánh</CardTitle>
              <CardDescription>Tháng này</CardDescription>
            </CardHeader>
            <CardContent>
              <BranchBarChart />
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <FadeIn delay={0.2} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng theo ngày</CardTitle>
              <CardDescription>Số lượng đơn trong 30 ngày qua</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersBarChart />
            </CardContent>
          </Card>
        </FadeIn>
        <FadeIn delay={0.25}>
          <RecentOrdersWidget />
        </FadeIn>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <FadeIn delay={0.3}>
          <TopProductsWidget />
        </FadeIn>
        <FadeIn delay={0.35}>
          <LowStockWidget />
        </FadeIn>
        <FadeIn delay={0.4}>
          <VipCustomersWidget />
        </FadeIn>
      </div>
    </PageShell>
  )
}
