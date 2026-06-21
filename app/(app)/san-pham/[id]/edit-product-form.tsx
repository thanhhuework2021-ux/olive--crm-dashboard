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
  const COLOR_OPTIONS = [
  'WHITE',
  'BLACK',
  'CREAM',
  'RED',
  'ORANGE',
  'YELLOW',
  'GREEN',
  'BLUE',
  'GREY',
]
  const [size, setSize] = useState(product.size || '')
  const [salePrice, setSalePrice] = useState(product.sale_price)
  const [costPrice, setCostPrice] =
  useState(product.cost_price || 0)
  const [imageUrl, setImageUrl] = useState(
    product.image_url || ''
  )

  const [loading, setLoading] = useState(false)

  const generateSku = (
  name: string,
  color: string
) => {

  const colorMap: Record<string, string> = {
    WHITE: 'WHT',
    ORANGE: 'ORG',
    BLACK: 'BLK',
    GREEN: 'GRN',
    CREAM: 'CRM',
    RED: 'RED',
    BLUE: 'BLU',
    YELLOW: 'YEL',
    GREY: 'GRY',
    GRAY: 'GRY',
  }

  const shortName = name
    .trim()
    .split(' ')
    .slice(-1)[0]
    .substring(0, 3)
    .toUpperCase()

  const random = Math.floor(
    100 + Math.random() * 900
  )

  return `DEN-${shortName}-${colorMap[
    color.toUpperCase()
  ] || 'NON'}-${random}`
}

const generatedSku =
  generateSku(name, color)

  const handleSave = async () => {
    try {
      setLoading(true)

      const { error } = await supabase
        .from('products')
        .update({
  sku: generatedSku,
  name,
  color,
  size,
  image_url: imageUrl,
  sale_price: Number(salePrice),
  cost_price: Number(costPrice),
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

     <div className="space-y-6">

  {/* SKU */}
  <div>
    <label>SKU</label>

    <input
      disabled
      value={generatedSku}
      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
    />
  </div>

  {/* TÊN SẢN PHẨM */}
  <div>
    <label>Tên sản phẩm</label>

    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3"
    />
  </div>

  {/* MÀU SẮC */}
  <div>
    <label>Màu sắc</label>

    <div className="mt-3 flex flex-wrap gap-2">

      {COLOR_OPTIONS.map((item) => (

        <button
          key={item}
          type="button"
          onClick={() => setColor(item)}
          className={`h-9 rounded-full px-4 text-xs font-semibold transition ${
            color === item
              ? 'bg-cyan-500 text-black'
              : 'bg-slate-800 hover:bg-slate-700'
          }`}
        >
          {item}
        </button>

      ))}

    </div>

    <input
      value={color}
      onChange={(e) =>
        setColor(e.target.value)
      }
      placeholder="Nhập màu khác..."
      className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900 p-3"
    />
  </div>

  {/* GIÁ NHẬP */}
  <div>
    <label>Giá nhập</label>

    <input
      type="number"
      value={costPrice}
      onChange={(e) =>
        setCostPrice(e.target.value)
      }
      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3"
    />
  </div>

  {/* GIÁ BÁN */}
<div>
  <label>Giá bán</label>

  <input
    type="number"
    value={salePrice}
    onChange={(e) =>
      setSalePrice(e.target.value)
    }
    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3"
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