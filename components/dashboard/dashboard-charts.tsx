'use client'

import type { RevenueChartItem } from '@/lib/types/dashboard'

import {
  Area,
  Line,
  ComposedChart,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from "recharts";


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
    <ChartContainer
  config={revenueConfig}
  className="mt-4 h-[300px] w-full"
>
      <ComposedChart
  data={data}
  margin={{
    top: 28,
    right: 12,
    left: 4,
    bottom: 10,
  }}
>
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
  yAxisId="left"
  tickFormatter={compact}
  tickLine={false}
  axisLine={false}
  width={45}
  fontSize={11}
/>

         <YAxis
  yAxisId="right"
  orientation="right"
  tickLine={false}
  axisLine={false}
  width={35}
  fontSize={11}
/>

      <ChartTooltip
  cursor={{
    stroke: "#3b82f6",
    strokeDasharray: "4 4",
  }}
  content={
    <ChartTooltipContent
      formatter={(value, name) => {
        if (name === "Doanh thu") {
          return new Intl.NumberFormat("vi-VN").format(Number(value)) + " ₫"
        }

        if (name === "Đơn hàng") {
          return `${value} đơn`
        }

        return String(value)
      }}
    />
  }
/>

        <Area
  yAxisId="left"
  type="natural"
  dataKey="revenue"
  name="Doanh thu"
  fill="url(#fillRevenue)"
  stroke="var(--color-revenue)"
  strokeWidth={3}

  dot={{
    r: 5,
    fill: "var(--color-revenue)",
    stroke: "#0f172a",
    strokeWidth: 2,
  }}

  activeDot={{
    r: 8,
    fill: "#fff",
    stroke: "var(--color-revenue)",
    strokeWidth: 3,
  }}
/>

<Line
  yAxisId="right"
  type="natural"
  name="Đơn hàng"
  dataKey="orders"
  stroke="#22c55e"
  strokeWidth={3}
  dot={{
    r: 4,
    fill: "#22c55e",
  }}
  activeDot={{
    r: 7,
    fill: "#fff",
    stroke: "#22c55e",
    strokeWidth: 3,
  }}
/>

      </ComposedChart>
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
        <CartesianGrid
  vertical={false}
  strokeDasharray="4 4"
  stroke="rgba(255,255,255,.08)"
/>

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
  cursor={{
    stroke: "#3b82f6",
    strokeDasharray: "4 4",
  }}
  content={
    <ChartTooltipContent
      formatter={(value, name) => {

        if (name === "revenue") {
          return [
            new Intl.NumberFormat("vi-VN").format(Number(value)) + " ₫",
            "Doanh thu",
          ]
        }

        return [`${value} đơn`, null]

      }}
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
