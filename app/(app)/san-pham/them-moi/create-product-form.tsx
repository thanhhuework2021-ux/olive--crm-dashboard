'use client'

import React, {
  useState,
  useEffect,
} from 'react'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  Tag,
  FolderOpen,
  Palette
} from 'lucide-react'



export default function CreateProductForm() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] =
  useState(false)

const [createdSku, setCreatedSku] =
  useState('')

  const [name, setName] = useState('')
  const [category, setCategory] = useState('DEN BAN')
 const [categories, setCategories] =
  useState<string[]>([])

const [showCategoryModal, setShowCategoryModal] =
  useState(false)

const [newCategory, setNewCategory] =
  useState('')
  //const [size, setSize] = useState('Medium')//
  const [color, setColor] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
  loadCategories()
}, [])

const loadCategories = async () => {
  const { data } =
    await supabase
      .from('categories')
      .select('name')
      .order('name')

  if (!data) return

  setCategories(
    data.map((item) => item.name)
  )
}

 const generateSku = (
  category: string,
  name: string,
  color: string
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

    

    const shortName = name
      .trim()
      .split(' ')
      .slice(-1)[0]
      .substring(0, 3)
      .toUpperCase()

    const random = Math.floor(100 + Math.random() * 900)

    const categoryCode =
  categoryMap[category] ||
  category
    .replace(/\s+/g, '')
    .substring(0, 3)
    .toUpperCase()

return `${categoryCode}-${shortName}-${colorMap[color.toUpperCase()] || 'NON'}-${random}`
  }

  const handleUpload = async (
e: React.ChangeEvent<HTMLInputElement>
) => {
const file = e.target.files?.[0]

if (!file) return

const fileName =
`${crypto.randomUUID()}.${
      file.name.split('.').pop()
    }`

const { error } =
await supabase.storage
.from('products')
.upload(fileName, file)

if (error) {
alert(error.message)
return
}

const { data } =
supabase.storage
.from('products')
.getPublicUrl(fileName)

setImageUrl(data.publicUrl)
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
  color
)

      const { error } = await supabase
        .from('products')
        .insert({
          sku,
          name,
          category,
    
          color,
          cost_price: Number(costPrice || 0),
          sale_price: Number(salePrice || 0),
          stock_quantity: 0,
          status: 'active',
          image_url: imageUrl,
        })

      if (error) {
        console.error(error)
        alert(error.message)
        return
      }

    setCreatedSku(sku)
setShowSuccessModal(true)
    } catch (error) {
      console.error(error)
      alert('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const previewSku =
  `${category
    .replace(/\s+/g, '')
    .substring(0,3)
    .toUpperCase()}-${
      (name || 'NEW')
        .split(' ')
        .slice(-1)[0]
        .substring(0,3)
        .toUpperCase()
    }-${
      (color || 'WHITE')
        .substring(0,3)
        .toUpperCase()
    }`

return (
  <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

      {/* LEFT */}

      <div className="lg:col-span-2 space-y-6">

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

          <div className="flex gap-2">

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="flex-1 rounded-lg border border-slate-700 bg-slate-900 p-3"
            >
              {categories.map((c) => (
                <option
                  key={c}
                  value={c}
                >
                  {c}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() =>
                setShowCategoryModal(true)
              }
              className="rounded-lg bg-cyan-500 px-4 font-bold text-black"
            >
              <Plus
  size={20}
  className="
    transition-transform
    duration-300
    group-hover:rotate-90
  "
/>
            </button>

          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm">
            Màu sắc
          </label>
      

          <div className="flex flex-wrap gap-2">
            {[
              'WHITE',
              'BLACK',
              'GREEN',
              'ORANGE',
              'CREAM',
              'RED',
            ].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`rounded-full px-4 py-2 text-sm ${
                  color === c
                    ? 'bg-cyan-500 text-black'
                    : 'bg-slate-800 text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3">
  <input
    value={color}
    onChange={(e) => setColor(e.target.value)}
    placeholder="Hoặc nhập màu mới..."
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
            onChange={(e) =>
              setCostPrice(e.target.value)
            }
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
            onChange={(e) =>
              setSalePrice(e.target.value)
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
          />
        </div>


      </div>

      {/* RIGHT */}

     <div className="space-y-4">

  <div className="
rounded-2xl
border
border-cyan-500/30
bg-gradient-to-br
from-cyan-500/10
to-slate-900
p-5
shadow-[0_0_30px_rgba(6,182,212,0.15)]
transition-all
duration-300
hover:shadow-[0_0_50px_rgba(6,182,212,0.35)]
hover:-translate-y-1
">
    
    <div className="flex items-center gap-2">
  <Tag size={14} className="text-cyan-400" />
  <p className="text-xs uppercase text-slate-400">
    SKU Preview
  </p>
</div>


    <p className="mt-3 font-mono text-xl font-bold text-cyan-400">
  {previewSku}
</p>

  </div>

  <div className="
rounded-2xl
border
border-cyan-500/30
bg-gradient-to-br
from-cyan-500/10
to-slate-900
p-5
shadow-[0_0_30px_rgba(6,182,212,0.15)]
transition-all
duration-300
hover:shadow-[0_0_50px_rgba(6,182,212,0.35)]
hover:-translate-y-1
">
    
    <div className="flex items-center gap-2">
  <FolderOpen size={14} className="text-cyan-400" />
  <p className="text-xs text-slate-400">
    Danh mục
  </p>
</div>

    <p className="mt-2 font-semibold">
      {category}
    </p>
  </div>

  <div className="
rounded-2xl
border
border-cyan-500/30
bg-gradient-to-br
from-cyan-500/10
to-slate-900
p-5
shadow-[0_0_30px_rgba(6,182,212,0.15)]
transition-all
duration-300
hover:shadow-[0_0_50px_rgba(6,182,212,0.35)]
hover:-translate-y-1
">
    
  <div className="flex items-center gap-2">
  <Palette size={14} className="text-cyan-400" />
  <p className="text-xs text-slate-400">
    Màu sắc
  </p>
</div>

    <p className="mt-2 font-semibold">
      {color || 'Chưa chọn'}
    </p>
  </div>

  <div>
    <p className="mb-2 text-sm font-medium">
      Hình ảnh sản phẩm
    </p>

    <label
  className="
  mx-auto
  flex
  h-56
  w-56
  cursor-pointer
      items-center
      justify-center
      overflow-hidden
      rounded-2xl
      border-2
      border-dashed
      border-slate-700
      bg-slate-900
      hover:border-cyan-500
      "
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="preview"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="text-center">
          <div className="text-5xl">
            📷
          </div>

          <p className="mt-2 text-sm">
            Upload ảnh sản phẩm
          </p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </label>
  </div>

</div>

    </div>

    <div className="mt-8 flex justify-end gap-3 border-t border-slate-800 pt-6">

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
        className="
  rounded-xl
  bg-cyan-500
  px-4
  font-bold
  text-black
  transition-all
  duration-300
  hover:scale-110
  hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]
  active:scale-95
"
      >
        {loading
          ? 'Đang lưu...'
          : 'Lưu sản phẩm'}
      </button>

    </div>

    {showCategoryModal && (
      <div
  className="
  fixed
  inset-0
  z-50
  flex
  items-center
  justify-center
  bg-black/60
  backdrop-blur-sm
  animate-in
  fade-in
  duration-300
"
>

        <div className="w-full max-w-md rounded-xl bg-slate-900 p-6">

          <h2 className="mb-4 text-xl font-bold">
            Tạo danh mục
          </h2>

          <input
            value={newCategory}
            onChange={(e) =>
              setNewCategory(
                e.target.value
              )
            }
            placeholder="VD: DEN TREO"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />

          <div className="mt-4 flex justify-end gap-2">

            <button
              type="button"
              onClick={() =>
                setShowCategoryModal(false)
              }
              className="rounded-lg border border-slate-700 px-4 py-2"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={async () => {
  if (!newCategory) return

  const categoryName =
    newCategory.toUpperCase()

  const { error } =
    await supabase
      .from('categories')
      .insert({
        name: categoryName,
        code: categoryName
          .replaceAll(' ', '')
          .substring(0, 3),
      })

  if (error) {
    alert(error.message)
    return
  }

  await loadCategories()

  setCategory(categoryName)

  setNewCategory('')
  setShowCategoryModal(false)

  router.refresh()
}}
              
              className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-black"
            >
              Lưu
            </button>

          </div>

        </div>

      </div>
    )}

    {showSuccessModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

    <div className="w-full max-w-md rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">

      <div className="mb-4 text-center">

        <div className="mb-3 text-5xl">
          ✅
        </div>

        <h2 className="text-xl font-bold">
          Tạo sản phẩm thành công
        </h2>

        <p className="mt-3 text-slate-400">
  Sản phẩm vừa tạo:
</p>

<p className="mt-2 text-lg font-semibold text-cyan-400">
  {name}
</p>

      </div>

      <div className="flex gap-3">

        <button
          onClick={() => {
            setShowSuccessModal(false)

            setName('')
            setColor('')
            setCostPrice('')
            setSalePrice('')
            setImageUrl('')
          }}
          className="
            flex-1
            rounded-xl
            border
            border-slate-700
            py-3
          "
        >
          Tạo tiếp
        </button>

        <button
          onClick={() =>
            router.push('/san-pham')
          }
          className="
            flex-1
            rounded-xl
            bg-cyan-500
            py-3
            font-semibold
            text-black
          "
                >
          Về danh sách
        </button>

      </div>

    </div>

  </div>

)}
    </div>
  )
}