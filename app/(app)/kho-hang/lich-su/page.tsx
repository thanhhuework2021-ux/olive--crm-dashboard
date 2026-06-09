import { supabase } from '@/lib/supabase'

export default async function LichSuKhoPage() {
  const { data: transactions } = await supabase
  .from('inventory_transactions')
  .select(`
    *,
    products (
      sku,
      name,
      color
    )
  `)
  .order('created_at', {
    ascending: false,
  })

  return (
    <div className="p-6 text-white">

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Lịch sử kho
        </h1>

        <p className="text-slate-400">
          Theo dõi nhập xuất kho
        </p>
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

      <div className="overflow-hidden rounded-xl border border-slate-800">

        <table className="w-full">

          <thead className="bg-slate-900">
            <tr>
              <th className="p-4 text-left">
                Ngày
              </th>

              <th className="p-4 text-left">
                SKU
              </th>
              <th className="p-4 text-left">
  Sản phẩm
</th>

<th className="p-4 text-left">
  Màu sắc
</th>

             <th className="p-4 text-left">
  Loại
</th>

<th className="p-4 text-left">
  Số lượng
</th>

<th className="p-4 text-left">
  Tồn sau
</th>

<th className="p-4 text-left">
  Chứng từ
</th>

<th className="p-4 text-left">
  Người tạo
</th>

<th className="p-4 text-left">
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
        {item.products?.sku}
      </td>

      <td className="p-4">
        {item.products?.name}
      </td>

      <td className="p-4">
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
          {item.products?.color || '-'}
        </span>
      </td>

      <td className="p-4">

        {item.transaction_type === 'IMPORT' ? (
          <span className="rounded-full bg-green-500 px-3 py-1 text-xs">
            NHẬP
          </span>
        ) : item.transaction_type === 'EXPORT' ? (
          <span className="rounded-full bg-red-500 px-3 py-1 text-xs">
            XUẤT
          </span>
        ) : item.transaction_type === 'SALE' ? (
          <span className="rounded-full bg-blue-500 px-3 py-1 text-xs">
            BÁN HÀNG
          </span>
        ) : (
          <span className="rounded-full bg-slate-500 px-3 py-1 text-xs">
            {item.transaction_type}
          </span>
        )}

      </td>

      <td className="p-4 font-semibold">

        {item.transaction_type === 'IMPORT'
          ? `+${item.quantity}`
          : `-${item.quantity}`}

      </td>

      <td className="p-4">
        {item.stock_after ?? '-'}
      </td>

      <td className="p-4 font-mono">
        {item.reference_id ?? '-'}
      </td>

      <td className="p-4">
        {item.created_by ?? '-'}
      </td>

      <td className="p-4">
        {item.note || '-'}
      </td>

    </tr>

  ))}

</tbody>

        </table>

      </div>

    </div>
  )
}