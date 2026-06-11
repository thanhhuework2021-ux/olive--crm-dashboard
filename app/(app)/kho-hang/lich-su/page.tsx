import { supabase } from '@/lib/supabase'
import DateFilter from '@/components/kho-hang/date-filter'
import Link from 'next/link'
import OrderReferenceButton from '@/components/kho-hang/order-reference-button'
export const dynamic = 'force-dynamic'
export const revalidate = 0
export default async function LichSuKhoPage({
  searchParams,
}: {
  searchParams: Promise<{
    range?: string
  }>
}) {

    const params = await searchParams

const range =
    params?.range || 'all'

const type =
  params?.type || 'all'

const startDate = new Date()

if (range === 'today') {
  startDate.setHours(0, 0, 0, 0)
}

if (range === 'yesterday') {
  startDate.setDate(
    startDate.getDate() - 1
  )

  startDate.setHours(0, 0, 0, 0)
}

if (range === '7') {
  startDate.setDate(
    startDate.getDate() - 7
  )
}

if (range === '30') {
  startDate.setDate(
    startDate.getDate() - 30
  )
}

if (range === '60') {
  startDate.setDate(
    startDate.getDate() - 60
  )
}

  let query = supabase
  .from('inventory_transactions')
  .select(`
    *,
    products (
      sku,
      name,
      color
    )
  `)

if (range !== 'all') {
  query = query.gte(
   'created_at',
   startDate.toISOString()
)
}

if (type !== 'all') {
  query = query.eq(
    'transaction_type',
    type
  )
}
const {
  data: transactions,
} = await query.order(
  'created_at',
  {
    ascending: false,
  }
)

console.log(
  'TRANSACTIONS',
  transactions?.length
)

  return (
    <div className="p-6 text-white">

    <div className="mb-6 flex items-start justify-between">

  <div>
    <h1 className="text-3xl font-bold">
      Lịch sử kho
    </h1>

    <p className="text-slate-400">
      Theo dõi nhập xuất kho
    </p>
  </div>

<DateFilter value={range} />

</div>

<div className="mb-6 flex gap-4">

  <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <p className="text-sm text-slate-400">
      Tổng lượt nhập
    </p>

    <h2 className="mt-2 text-3xl font-bold text-green-400">
      {
        transactions?.filter(
          (x) =>
            x.transaction_type === 'IMPORT'
        ).length || 0
      }
    </h2>
  </div>

  <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <p className="text-sm text-slate-400">
      Tổng lượt xuất
    </p>

    <h2 className="mt-2 text-3xl font-bold text-red-400">
      {
        transactions?.filter(
          (x) =>
            x.transaction_type === 'EXPORT'
        ).length || 0
      }
    </h2>
  </div>

  <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <p className="text-sm text-slate-400">
      Tổng giao dịch kho
    </p>

    <h2 className="mt-2 text-3xl font-bold text-cyan-400">
  {transactions?.length || 0}
</h2>
</div>

</div>

<div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
  <table className="w-full text-sm">

     <thead
  className="
    sticky
    top-0
    z-10
    border-b
    border-slate-700
    bg-slate-950
    backdrop-blur
  "
>
  <tr>

    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
      Ngày
    </th>

    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
      SKU
    </th>

    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
      Sản phẩm
    </th>

    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
  Màu sắc
</th>

    <th className="w-28 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
  Loại
</th>

    <th className="w-24 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
      Số lượng
    </th>

<th className="w-24 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
      Tồn sau
    </th>

    <th className="w-52 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
      Chứng từ
    </th>

    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
  Người tạo
</th>

    <th className="w-40 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
      Ghi chú
    </th>

  </tr>
</thead>

          <tbody>

  {transactions?.map((item: any) => (

    <tr
      key={item.id}
      className="border-t border-slate-800"
    >
      <td className="p-4">
        {new Date(
          item.created_at
        ).toLocaleString('vi-VN')}
      </td>

      <td className="p-4">
  <span className="whitespace-nowrap font-medium">
    {item.sku}
  </span>
</td>

      <td className="p-4">
        {item.products?.name}
      </td>

      <td className="w-32 p-4 text-left">
  <span className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs">
    {item.products?.color || '-'}
  </span>
</td>

      <td className="p-4 text-left">

        {item.transaction_type === 'IMPORT' ? (
          <span className="rounded-full bg-green-500 px-3 py-1 text-xs">
            NHẬP
          </span>
        ) : item.transaction_type === 'EXPORT' ? (
          <span className="rounded-full bg-red-500 px-3 py-1 text-xs">
            XUẤT
          </span>
        ) : item.transaction_type === 'SALE' ? (
          <span className="whitespace-nowrap rounded-full bg-blue-500 px-3 py-1 text-xs">
            BÁN HÀNG
          </span>
        ) : (
          <span className="
inline-flex
items-center
justify-center
rounded-full
bg-blue-500
px-4
py-1.5
text-xs
font-semibold
shadow-lg
">
            {item.transaction_type}
          </span>
        )}

      </td>

      <td className="p-4 text-center font-bold">
  <span
    className={
      item.transaction_type === 'IMPORT'
        ? 'text-green-400'
        : item.transaction_type === 'SALE'
        ? 'text-blue-400'
        : 'text-red-400'
    }
  >
    {item.quantity}
  </span>
</td>

      <td className="p-4 text-center font-bold">
  {item.stock_after ?? '-'}
</td>

      <td className="p-4">
  <OrderReferenceButton
    referenceId={item.reference_id}
  />
</td>

      <td className="p-4 text-left">
  <span className="text-slate-200 font-medium">
    {item.created_by ?? '-'}
  </span>
</td>

      <td className="p-4">
        {item.transaction_type === 'SALE'
  ? 'Ngày bán hàng'
  : item.transaction_type === 'IMPORT'
  ? 'Nhập kho'
  : item.note}
      </td>

    </tr>

  ))}

</tbody>

</table>

</div>

</div>
  )
}