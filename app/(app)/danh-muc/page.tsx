import { supabase } from '@/lib/supabase'
import CategoriesTable from '@/components/categories/categories-table'
import AddCategoryButton from '@/components/categories/add-category-button'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  const { data: products } = await supabase
    .from('products')
    .select('category')

  const countMap: Record<string, number> = {}

  products?.forEach((p) => {
    countMap[p.category] =
      (countMap[p.category] || 0) + 1
  })

  return (
    <div className="p-6 text-white">

      <div className="mb-6 flex items-start justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Danh mục
          </h1>

          <p className="text-slate-400">
            Quản lý danh mục sản phẩm
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AddCategoryButton />
        </div>

      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800">

        <CategoriesTable
          categories={categories || []}
          countMap={countMap}
        />

      </div>

    </div>
  )
}