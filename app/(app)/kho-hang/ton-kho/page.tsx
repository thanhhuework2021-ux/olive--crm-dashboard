import { supabase } from '@/lib/supabase'

import CategoryFilter from '@/components/kho-hang/category-filter'
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

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    category?: string
  }>
}) {

  const params =
  await searchParams

const currentPage =
  Number(params.page || 1)

const category =
  params.category || 'all'

const pageSize = 10

  

  const {
  count,
} = await supabase
  .from('products')
  .select('*', {
    count: 'exact',
    head: true,
  })

const from =
  (currentPage - 1) * pageSize

const to =
  from + pageSize - 1

let query = supabase
  .from('products')
  .select('*')
  .order('sku')

if (category !== 'all') {
  query = query.eq(
    'category',
    category
  )
}

const { data: inventory } =
  await query.range(from, to)

  const totalPages =
  Math.ceil(
    (count || 0) /
    pageSize
  )

  console.log(
  'COUNT',
  count,
  'TOTAL PAGES',
  totalPages
)

  const totalSku = count || 0

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
  (item) =>
    (item.stock_quantity || 0) > 0 &&
    (item.stock_quantity || 0) < 10
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

<CategoryFilter
  category={category}
/>
 
          </div>

          <Table>

            <TableHeader>

              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Sản phẩm</TableHead>
<TableHead>Màu sắc</TableHead>
<TableHead>Danh mục</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead>Giá nhập</TableHead>
                <TableHead>Giá bán</TableHead>
                <TableHead>Giá trị tồn</TableHead>
              </TableRow>

            </TableHeader>

            <TableBody>

              {inventory?.map((item) => (
                <TableRow key={item.sku}>

                  <TableCell>{item.sku}</TableCell>

                  <TableCell>
  {item.name}
</TableCell>

<TableCell>

  <div className="flex items-center gap-2">

    <div
      className="h-3 w-3 rounded-full"
      style={{
        background:
          item.color?.toLowerCase() === 'red'
            ? '#ef4444'
            : item.color?.toLowerCase() === 'green'
            ? '#22c55e'
            : item.color?.toLowerCase() === 'black'
            ? '#000'
            : item.color?.toLowerCase() === 'white'
            ? '#fff'
            : item.color?.toLowerCase() === 'orange'
            ? '#f97316'
            : '#64748b',
      }}
    />

    <span>
      {item.color || '-'}
    </span>

  </div>

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
                    {(
  (item.stock_quantity || 0) *
  (item.cost_price || 0)
).toLocaleString('vi-VN')} đ
                  </TableCell>

                </TableRow>
              ))}

            </TableBody>

          </Table>

    <div className="mt-6 flex justify-center gap-2">

  {Array.from(
    { length: totalPages },
    (_, i) => (

      <a
        key={i}
        href={`/kho-hang/ton-kho?page=${i + 1}`}
        className={`
          rounded-lg
          border
          px-4
          py-2
          font-semibold

          ${
            currentPage === i + 1
              ? 'bg-cyan-500 text-black'
              : 'bg-slate-900'
          }
        `}
      >
        {i + 1}
      </a>

    )
  )}

</div>

        </CardContent>

      </Card>

    </div>
  )
}