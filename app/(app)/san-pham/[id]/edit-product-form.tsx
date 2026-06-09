'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EditProductForm({
  product,
}: {
  product: any
}) {
  const router = useRouter()

  const [name, setName] = useState(product.name)
  const [color, setColor] = useState(product.color || '')
  const [size, setSize] = useState(product.size || '')
  const [salePrice, setSalePrice] = useState(product.sale_price)
  const [imageUrl, setImageUrl] = useState(
    product.image_url || ''
  )

  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    try {
      setLoading(true)

      const { error } = await supabase
        .from('products')
        .update({
          name,
          color,
          size,
          image_url: imageUrl,
          sale_price: Number(salePrice),
        })
        .eq('id', product.id)

      if (error) {
        alert(error.message)
        return
      }

      alert('Đã cập nhật sản phẩm')

      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    const fileName = `${crypto.randomUUID()}.${
      file.name.split('.').pop()
    }`

    const { error } = await supabase.storage
      .from('products')
      .upload(fileName, file)

    if (error) {
      alert(error.message)
      return
    }

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    setImageUrl(data.publicUrl)

    alert('Upload ảnh thành công')
  }

  const handleDelete = async () => {
    const ok = confirm(
      'Bạn có chắc muốn xóa sản phẩm này?'
    )

    if (!ok) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)

    if (error) {
      alert(error.message)
      return
    }

    alert('Đã xóa sản phẩm')

    router.push('/san-pham')
    router.refresh()
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

      <div className="grid grid-cols-2 gap-4">

        <div>
          <label>SKU</label>

          <input
            disabled
            value={product.sku}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label>SKU MASTER</label>

          <input
            disabled
            value={product.sku_master || ''}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label>Tên sản phẩm</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
          />
        </div>

        <div>
          <label>Màu sắc</label>

          <input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
          />
        </div>

        <div>
          <label>Size</label>

          <input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
          />
        </div>

        <div>
          <label>Giá bán</label>

          <input
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
          />
        </div>

      </div>

      <div className="mt-8">
        <label className="mb-3 block">
          Hình ảnh sản phẩm
        </label>

        {imageUrl && (
          <img
            src={imageUrl}
            alt="preview"
            className="mb-4 h-40 w-40 rounded-lg object-cover"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">

        <button
          onClick={handleDelete}
          className="rounded-lg bg-red-500 px-5 py-2 font-semibold text-white"
        >
          Xóa sản phẩm
        </button>

        <button
          onClick={handleSave}
          disabled={loading}
          className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-black"
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>

      </div>

    </div>
  )
}