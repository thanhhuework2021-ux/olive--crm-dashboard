'use client'

import type { RevenueChartItem } from '@/lib/types/dashboard'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { revenueByDay, revenueByBranch } from '@/lib/data'

function compact(v: number) {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}T`
  if (v >= 1_000_000) return `${Math.round(v / 1_000_000)}Tr`
  if (v >= 1_000) return `${Math.round(v / 1_000)}K`
  return `${v}`
}

const revenueConfig = {
  revenue: { label: 'Doanh thu', color: 'var(--chart-1)' },
} satisfies ChartConfig

export function RevenueAreaChart({
  data,
}: {
  data: RevenueChartItem[]
}) {
  return (
    <ChartContainer config={revenueConfig} className="h-[260px] w-full">
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
          fontSize={11}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={compact}
          width={40}
          fontSize={11}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => [
                new Intl.NumberFormat('vi-VN').format(Number(value)) + ' ₫',
                ' Doanh thu',
              ]}
            />
          }
        />
        <Area
          dataKey="revenue"
          type="monotone"
          fill="url(#fillRevenue)"
          stroke="var(--color-revenue)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}

const ordersConfig = {
  orders: { label: 'Đơn hàng', color: 'var(--chart-1)' },
} satisfies ChartConfig

export function OrdersBarChart({
  data,
}: {
  data: RevenueChartItem[]
}) {
  return (
    <ChartContainer config={ordersConfig} className="h-[260px] w-full">
      <BarChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
          fontSize={11}
        />
        <YAxis tickLine={false} axisLine={false} width={28} fontSize={11} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

const branchConfig = {
  revenue: { label: 'Doanh thu' },
} satisfies ChartConfig

const branchColors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)']

export function BranchBarChart() {
  return (
    <ChartContainer config={branchConfig} className="h-[260px] w-full">
      <BarChart
        data={revenueByBranch}
        layout="vertical"
        margin={{ left: 8, right: 16 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" tickFormatter={compact} fontSize={11} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="branch"
          width={70}
          fontSize={11}
          axisLine={false}
          tickLine={false}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => [
                new Intl.NumberFormat('vi-VN').format(Number(value)) + ' ₫',
                ' Doanh thu',
              ]}
            />
          }
        />
        <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
          {revenueByBranch.map((_, i) => (
            <Cell key={i} fill={branchColors[i % branchColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
