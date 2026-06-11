import { supabase } from '@/lib/supabase'

import {
  Package,
  AlertTriangle,
  Archive,
  Search,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {

  const { data: inventory } =
    await supabase
      .from('products')
      .select('*')
      .order('sku')

  const totalSku = inventory?.length || 0

  const totalStock = (inventory || []).reduce(
    (acc, item) => acc + (item.stock_quantity || 0),
    0
  )

  const totalValue = (inventory || []).reduce(
    (acc, item) =>
      acc +
      (item.stock_quantity || 0) *
      (item.cost_price || 0),
    0
  )

  const lowStock = (inventory || []).filter(
    (item) => (item.stock_quantity || 0) < 10
  ).length

  return (
    <div className="space-y-6 p-6">

      <div>
        <h1 className="text-3xl font-bold">
          Tồn kho
        </h1>

        <p className="text-muted-foreground">
          Theo dõi số lượng hàng hóa hiện có
        </p>
      </div>

      {/* KPI */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span>Tổng SKU</span>
              <Package className="h-5 w-5 text-sky-500" />
            </div>

            <div className="mt-4 text-3xl font-bold">
              {totalSku}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span>Tổng tồn kho</span>
              <Archive className="h-5 w-5 text-sky-500" />
            </div>

            <div className="mt-4 text-3xl font-bold">
              {totalStock}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span>Sắp hết hàng</span>
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>

            <div className="mt-4 text-3xl font-bold">
              {lowStock}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span>Giá trị tồn</span>
              <Package className="h-5 w-5 text-green-500" />
            </div>

            <div className="mt-4 text-2xl font-bold">
              {totalValue.toLocaleString("vi-VN")} đ
            </div>
          </CardContent>
        </Card>

      </div>

      {/* TABLE */}

      <Card>

        <CardContent className="p-6">

          <div className="mb-6 flex items-center gap-3">

            <div className="relative w-full max-w-md">

              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Tìm SKU hoặc sản phẩm..."
                className="pl-10"
              />

            </div>

          </div>

          <Table>

            <TableHeader>

              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead>Giá nhập</TableHead>
                <TableHead>Giá bán</TableHead>
                <TableHead>Giá trị tồn</TableHead>
              </TableRow>

            </TableHeader>

            <TableBody>

              {inventory.map((item) => (
                <TableRow key={item.sku}>

                  <TableCell>{item.sku}</TableCell>

                  <TableCell>
                    {item.name}
                  </TableCell>

                  <TableCell>
                    {item.category}
                  </TableCell>

                  <TableCell>
                    {item.stock_quantity}
                  </TableCell>

                  <TableCell>
                    {(item.cost_price || 0).toLocaleString("vi-VN")} đ
                  </TableCell>

                  <TableCell>
                    {(item.sale_price || 0).toLocaleString("vi-VN")} đ
                  </TableCell>

                  <TableCell>
                    {(item.stock_quantity || 0) *
(item.cost_price || 0).toLocaleString("vi-VN")} đ
                  </TableCell>

                </TableRow>
              ))}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

    </div>
  )
}