'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CreateProductForm() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('DEN BAN')
  const [size, setSize] = useState('Medium')
  const [color, setColor] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')

  const generateSku = (
    category: string,
    name: string,
    color: string,
    size: string
  ) => {
    const categoryMap: Record<string, string> = {
      'DEN BAN': 'DEN',
      'DEN CAY': 'DCY',
      THAM: 'THM',
      LICH: 'LIC',
    }

    const colorMap: Record<string, string> = {
      WHITE: 'WHT',
      ORANGE: 'ORG',
      BLACK: 'BLK',
      GREEN: 'GRN',
      CREAM: 'CRM',
      RED: 'RED',
      BLUE: 'BLU',
      YELLOW: 'YEL',
    }

    const sizeMap: Record<string, string> = {
      Small: 'S',
      Medium: 'M',
      Large: 'L',
    }

    const shortName = name
      .trim()
      .split(' ')
      .slice(-1)[0]
      .substring(0, 3)
      .toUpperCase()

    const random = Math.floor(100 + Math.random() * 900)

    return `${categoryMap[category]}-${shortName}-${colorMap[color.toUpperCase()] || 'NON'}-${sizeMap[size]}-${random}`
  }

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên sản phẩm')
      return
    }

    try {
      setLoading(true)

      const sku = generateSku(
        category,
        name,
        color,
        size
      )

      const { error } = await supabase
        .from('products')
        .insert({
          sku,
          name,
          category,
          size,
          color,
          cost_price: Number(costPrice || 0),
          sale_price: Number(salePrice || 0),
          stock_quantity: 0,
          status: 'active',
        })

      if (error) {
        console.error(error)
        alert(error.message)
        return
      }

      alert(`Đã tạo sản phẩm ${sku}`)

      router.push('/san-pham')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="mb-2 block text-sm">
            Tên sản phẩm
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên sản phẩm"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Danh mục
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
          >
            <option value="DEN BAN">Đèn bàn</option>
            <option value="DEN CAY">Đèn cây</option>
            <option value="THAM">Thảm</option>
            <option value="LICH">Lịch</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Size
          </label>

          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
          >
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Màu sắc
          </label>

          <input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="WHITE"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Giá nhập
          </label>

          <input
            type="number"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            placeholder="0"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Giá bán
          </label>

          <input
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            placeholder="0"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
          />
        </div>

      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push('/san-pham')}
          className="rounded-lg border border-slate-700 px-4 py-2"
        >
          Hủy
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-black"
        >
          {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>
      </div>
    </div>
  )
}