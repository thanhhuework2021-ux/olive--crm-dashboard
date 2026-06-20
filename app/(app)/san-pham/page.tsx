import Link from 'next/link'
import { supabase } from '@/lib/supabase'
export const dynamic = 'force-dynamic'
import ProductsTable from '@/components/products/products-table'
import CategoryFilter from '@/components/products/category-filter'

export default async function ProductsPage({
  searchParams,
}: {

  searchParams: Promise<{
  category?: string
  status?: string
}>

}) {


  const params = await searchParams

const category =
  params.category || 'ALL'

const status =
  params.status || 'ACTIVE'



let query = supabase
  .from('products')
  .select('*')

if (status === 'ACTIVE') {
  query = query.eq('status', 'active')
}

if (status === 'INACTIVE') {
  query = query.eq('status', 'inactive')
}

if (category !== 'ALL') {
  query = query.eq(
    'category',
    category
  )
}

const { data: products } =
  await query.order('sku')


console.log(
  'PRODUCT COUNT:',
  products?.length
)

const {
  data: categories,
  error: categoriesError,
} = await supabase
  .from('categories')
.select('*')
.eq('status', 'active')
.order('name')

console.log(
  'CATEGORIES ERROR:',
  categoriesError
)

console.log(
  'CATEGORIES:',
  categories
)

  console.log('CATEGORIES:', categories)

  return (
     


    <div className="p-6 text-white">
      
      <div className="mb-6 flex items-start justify-between">

  <div>
    <h1 className="text-3xl font-bold">
      Sản phẩm
    </h1>

    <p className="text-slate-400">
      Quản lý danh mục sản phẩm
    </p>
  </div>

  <div className="flex items-center gap-3">

  <CategoryFilter
  category={category}
  categories={categories || []}
/>

  <Link
    href="/san-pham/them-moi"
    className="
      rounded-xl
      bg-cyan-500
      px-5
      py-3
      font-semibold
      text-black
      transition
      hover:scale-105
    "
  >
    + Thêm sản phẩm
  </Link>

</div>

</div>


      <div className="overflow-hidden rounded-xl border border-slate-800">
  <ProductsTable products={products || []} />
</div>

    </div>
  )
}