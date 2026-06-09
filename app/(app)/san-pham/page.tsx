import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ProductsTable from '@/components/products/products-table'

export default async function ProductsPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('sku')

  return (
    <div className="p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Sản phẩm
          </h1>
          <p className="text-slate-400">
            Quản lý danh mục sản phẩm
          </p>
        </div>

        <Link
  href="/san-pham/them-moi"
  className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-black"
>
  + Thêm sản phẩm
</Link>
      </div>

      <div className="mb-4">
        <input
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800">
  <ProductsTable products={products || []} />
</div>

    </div>
  )
}