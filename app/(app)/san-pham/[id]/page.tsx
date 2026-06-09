import { supabase } from '@/lib/supabase'
import EditProductForm from './edit-product-form'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold">
          Không tìm thấy sản phẩm
        </h1>
      </div>
    )
  }

  return (
    <div className="p-6 text-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Chỉnh sửa sản phẩm
        </h1>

        <p className="text-slate-400">
          {product.name}
        </p>
      </div>

      <EditProductForm product={product} />
    </div>
  )
}