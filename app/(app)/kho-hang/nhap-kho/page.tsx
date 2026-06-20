import { supabase } from '@/lib/supabase'
import NhapKhoForm from './nhap-kho-form'

export const dynamic = 'force-dynamic'

export default async function NhapKhoPage() {
  const { data: products } =
    await supabase
      .from('products')
      .select('*')
      .order('sku')

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold">
        Nhập kho
      </h1>

      <NhapKhoForm
        products={products || []}
      />
    </div>
  )
}