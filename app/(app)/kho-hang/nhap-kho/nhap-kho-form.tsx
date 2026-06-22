'use client'

import {
  useState,
  useEffect,
} from 'react'

import Link from 'next/link'

import { supabase } from '@/lib/supabase'
export const dynamic = 'force-dynamic'

export default function NhapKhoForm({
  products,
}: {
  products: any[]
}) {

const [showAll, setShowAll] =
  useState(false)

const [selectedId, setSelectedId] =
    useState('')

const [selectedName, setSelectedName] =
  useState('')

const [selectedColor, setSelectedColor] =
  useState('')

    const [quantity, setQuantity] =
  useState('')

const [note, setNote] =
  useState('')

const [loading, setLoading] =
  useState(false)

const [history, setHistory] =
  useState<any[]>([])

const [search,setSearch] =
  useState('')


  const variants =
  products.filter(
    (p) =>
      p.name?.trim() ===
      selectedName?.trim()
  )

const selectedProduct =
  products.find(
    (p) =>
      p.name === selectedName &&
      p.color === selectedColor
  ) || variants[0]

  const filteredProducts =
  products.filter((p) =>
    p.name
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )
  )

  const [imageUrl, setImageUrl] =
  useState('')

  const [costPrice, setCostPrice] =
  useState('0')

  const [salePrice, setSalePrice] =
  useState('0')

  useEffect(() => {

  if (!selectedProduct) return

  setCostPrice(
    String(
      selectedProduct.cost_price || 0
    )
  )

  setSalePrice(
    String(
      selectedProduct.sale_price || 0
    )
  )

}, [selectedProduct])



  useEffect(() => {

  if (
    products.length > 0 &&
    !selectedName
  ) {
    setSelectedName(
      products[0].name
    )
  }

}, [products])


useEffect(() => {

  if (
    variants.length > 0
  ) {

    setSelectedColor(
      variants[0].color || ''
    )

  }

}, [selectedName])

useEffect(() => {

  if (!selectedProduct) return

  setCostPrice(
    String(
      selectedProduct.cost_price || 0
    )
  )

  setSalePrice(
    String(
      selectedProduct.sale_price || 0
    )
  )

}, [selectedId])

  useEffect(() => {

  if (!selectedProduct?.id) return

  const loadHistory = async () => {

    const { data, error } =
      await supabase
        .from('inventory_transactions')
        .select('*')
        .eq(
          'product_id',
          selectedProduct.id
        )
        .eq(
          'transaction_type',
          'IMPORT'
        )
        .order(
          'created_at',
          {
            ascending: false,
          
          }
        )
        .limit(3)

    console.log(
      'PRODUCT:',
      selectedProduct.id
    )

    console.log(
      'HISTORY:',
      data
    )

    setHistory(data || [])
  }

  loadHistory()

}, [selectedProduct])

    const currentUser = 'ADMIN'

    const handleImport = async () => {
  if (!selectedProduct) {
    alert('Vui lòng chọn sản phẩm')
    return
  }

  if (!quantity) {
    alert('Vui lòng nhập số lượng')
    return
  }

  try {
    setLoading(true)

    const qty = Number(quantity)

    // cập nhật tồn kho
    const { error: updateError } =
      await supabase
        .from('products')
        .update({
  stock_quantity:
    selectedProduct.stock_quantity + qty,

  cost_price:
    Number(costPrice),

  sale_price:
    Number(salePrice),

  image_url:
    imageUrl ||
    selectedProduct.image_url,
})
  
        .eq('id', selectedProduct.id)

    if (updateError) {
      alert(updateError.message)
      return
    }

    // ghi lịch sử
    const { error: logError } =
  await supabase
    .from('inventory_transactions')
    .insert({
      product_id: selectedProduct.id,

      sku: selectedProduct.sku,

      transaction_type: 'IMPORT',

      quantity: qty,

  

      stock_after:
        selectedProduct.stock_quantity + qty,

      reference_type: 'PURCHASE',

      reference_id:
        `PN${Date.now()}`,

      created_by: currentUser,

      note,


    })

    

    if (logError) {
      alert(logError.message)
      return
    }

  alert('Nhập kho thành công')

setQuantity('')
setNote('')

location.reload()

} catch (err) {

  console.error(err)

  alert('Có lỗi xảy ra')

} finally {

  setLoading(false)

}

}

return (



    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-6">

    <div className="mb-2 flex items-center justify-between">

  <label>
    Tìm sản phẩm
  </label>

  <div className="flex items-center gap-3">

  <Link
    href="/san-pham/them-moi"
    className="
      rounded-lg
      bg-cyan-500
      px-4
      py-2
      text-sm
      font-medium
      text-black
      transition
      hover:scale-105
    "
  >
    + Tạo sản phẩm nhanh
  </Link>

  <button
    type="button"
    onClick={() =>
      setShowAll(!showAll)
    }
    className="
      rounded-lg
      border
      border-slate-700
      bg-slate-900
      px-4
      py-2
      text-sm
      hover:border-cyan-500
    "
  >
    {showAll
      ? '▲ Thu gọn'
      : '▼ Hiển thị tất cả'}
  </button>

</div>

</div>

<input
  placeholder="Nhập tên sản phẩm..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  className="
    w-full
    rounded-xl
    border
    border-slate-700
    bg-slate-900
    p-3
    text-white
  "
/>

<div className="mb-4 flex justify-end">

</div>

<div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">

  {filteredProducts
    .slice(
      0,
      showAll
        ? filteredProducts.length
        : 8
    )
    .map((item) => (

    <button
  key={item.name}
  type="button"
  onClick={() => {
    setSelectedName(item.name)
  }}
  className={`
    flex
    items-center
    gap-3
    rounded-xl
    border
    p-3
    transition
    ${
      selectedName === item.name
        ? 'border-cyan-500 bg-cyan-500/10'
        : 'border-slate-700 bg-slate-900 hover:border-cyan-500'
    }
  `}
>

  <img
    src={
      item.image_url ||
      '/placeholder.jpg'
    }
    alt={item.name}
    className="
      h-12
      w-12
      rounded-lg
      object-cover
      border
      border-slate-700
      shrink-0
    "
  />

  <div
    className="
      truncate
      text-sm
      font-medium
      text-left
    "
  >
    {item.name}
  </div>

</button>

  ))}

  </div>

{selectedProduct && (

  <div className="mt-6 space-y-6">

    <div
 
  className="
    grid
    grid-cols-1
    lg:grid-cols-5
    gap-5
    items-stretch
  "
>

  {/* LEFT */}
<div
  
  className="
    lg:col-span-2
    rounded-2xl
    border
    border-slate-800
    bg-slate-900
    p-5
    h-full
    flex
    flex-col
  "
>

    <img

  src={
  imageUrl ||
  selectedProduct.image_url ||
  '/placeholder.jpg'
}

  alt={selectedProduct.name}
  className="
  mx-auto
  h-[220px]
  w-[220px]
  rounded-xl
  object-cover
  border
  border-slate-700
"
/>

  <div className="mt-4">

  <label
    className="
      flex
      cursor-pointer
      items-center
      justify-center
      rounded-xl
      bg-cyan-500
      py-3
      font-semibold
      text-black
      hover:bg-cyan-400
    "
  >
    📷 Tải ảnh mới lên

    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={async (e) => {

  const file =
    e.target.files?.[0]

  if (!file) return

  const ext =
    file.name.split('.').pop()

  const fileName =
    `${Date.now()}.${ext}`

  const { error } =
    await supabase.storage
      .from('products')
      .upload(
        fileName,
        file,
        {
          upsert: true
        }
      )

  if (error) {
    alert(error.message)
    return
  }

  const { data } =
    supabase.storage
      .from('products')
      .getPublicUrl(
        fileName
      )

  const publicUrl =
    data.publicUrl

  const { error: updateError } =
    await supabase
      .from('products')
      .update({
        image_url: publicUrl
      })
      .eq(
        'id',
        selectedProduct.id
      )

  if (updateError) {
    alert(updateError.message)
    return
  }

  setImageUrl(publicUrl)

  alert(
    'Cập nhật ảnh thành công'
  )

}}
    />

  </label>

</div>

<div
  className="
    mt-4
    rounded-2xl
    border
    border-slate-800
    bg-slate-900
    p-5
  "
>

  <h2 className="mb-4 text-xl font-bold text-cyan-400">
    {selectedProduct.name}
  </h2>


  {variants.length > 1 && (

    

  <div className="mt-3">

    <label className="mb-2 block text-sm text-slate-400">
      Chọn màu
    </label>

    <select
      value={selectedColor}
      onChange={(e) =>
        setSelectedColor(
          e.target.value
        )
      }
      className="
        w-full
        rounded-xl
        border
        border-slate-700
        bg-slate-900
        p-2
      "
    >

      {variants.map((item) => (

        <option
          key={item.id}
          value={item.color}
        >
          {item.color}
        </option>

      ))}

    </select>

  </div>

)}

  <div className="grid grid-cols-2 gap-4 text-sm">

    <div>
      <p className="text-slate-400">SKU</p>
      <p>{selectedProduct.sku}</p>
    </div>

    <div>
      <p className="text-slate-400">Tồn kho</p>
      <p className="text-green-400">
        {selectedProduct.stock_quantity}
      </p>
    </div>

    <div>
      <p className="text-slate-400">Danh mục</p>
      <p>{selectedProduct.category}</p>
    </div>

    <div>
      <p className="text-slate-400">Màu sắc</p>
      <p>{selectedProduct.color}</p>
    </div>

    <div>
      <p className="text-slate-400">Giá nhập cũ</p>
      <p>
        {Number(
          selectedProduct.cost_price || 0
        ).toLocaleString('vi-VN')} đ
      </p>
    </div>

    <div>
      <p className="text-slate-400">
        Giá bán hiện tại
      </p>
      <p className="text-cyan-400">
        {Number(
          selectedProduct.sale_price || 0
        ).toLocaleString('vi-VN')} đ
      </p>
    </div>

  </div>

</div>

</div>


{/* RIGHT */}
<div
  className="
    lg:col-span-3
    rounded-2xl
    border
    border-slate-800
    bg-slate-900
    p-5
    self-start
  "
>

  <h3 className="mb-5 text-xl font-bold text-cyan-400">
    FORM NHẬP HÀNG MỚI
  </h3>

  <div className="grid grid-cols-2 gap-4">

    <div>
  <label>Giá nhập mới</label>

  <input
    type="number"
    value={costPrice}
    onChange={(e) =>
      setCostPrice(e.target.value)
    }
    className="
      mt-2
      w-full
      rounded-xl
      border
      border-slate-700
      bg-slate-950
      p-3
      text-white
      focus:border-cyan-500
      focus:outline-none
    "
  />
</div>

<div>
  <label>Giá bán mới</label>

  <input
    type="number"
    value={salePrice}
    onChange={(e) =>
      setSalePrice(e.target.value)
    }
    className="
      mt-2
      w-full
      rounded-xl
      border
      border-slate-700
      bg-slate-950
      p-3
      text-white
      focus:border-cyan-500
      focus:outline-none
    "
  />
</div>

  </div>

  <div className="mt-4">

    <label>Số lượng nhập</label>

    <input
      type="number"
      value={quantity}
      onChange={(e) =>
        setQuantity(e.target.value)
      }
      className="
        mt-2
        w-full
        rounded-xl
        border
        border-slate-700
        bg-slate-950
        p-3
      "
    />

  </div>

 <div className="mt-3 rounded-lg bg-cyan-500/10 px-3 py-2">

  <div className="flex items-center justify-between">

    <span className="text-xs text-slate-400">
      Tạm tính
    </span>

    <span className="text-base font-bold text-cyan-400">
      {(
        Number(costPrice) *
        Number(quantity || 0)
      ).toLocaleString('vi-VN')} đ
    </span>

  </div>

</div>

  <div className="mt-4">

    <label>Ghi chú nhập hàng</label>

    <textarea
  value={note}
  onChange={(e) =>
    setNote(e.target.value)
  }
  rows={2}
  className="
    mt-2
    w-full
    rounded-xl
    border
    border-slate-700
    bg-slate-950
    p-2
    text-sm
    resize-none
  "
/>

  </div>

  <div
  className="
    mt-6
    h-[180px]
  "
>

  <h4 className="mb-2 text-sm font-bold text-cyan-400">
 Thời gian nhập hàng gần nhất
</h4>

  <div
  className="
    space-y-1
    h-[135px]
    overflow-hidden
  "
>

    {history.map((item) => (

      <div
        key={item.id}
        className="
  rounded-lg
  border
  border-slate-700
  bg-slate-950
  px-3
  py-2
  text-xs
"
      >

        <div className="flex justify-between">

          <span>
            +
            {item.quantity}
            sản phẩm
          </span>

          <span>
            {new Date(
              item.created_at
            ).toLocaleDateString(
              'vi-VN'
            )}
          </span>

        </div>

      </div>

    ))}

  </div>

</div>

  <button
  onClick={handleImport}
  disabled={loading}
  className="
    mt-5
    w-full
    rounded-xl
    bg-cyan-500
    py-3
    font-semibold
    text-black
    transition-all
    duration-300
    hover:scale-[1.02]
    hover:bg-cyan-400
    hover:shadow-[0_0_25px_rgba(34,211,238,0.45)]
    active:scale-[0.98]
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
>
    {loading
      ? 'Đang nhập...'
      : 'Nhập kho'}
  </button>

</div>

</div> 

</div>

)}

</div> 

  )
}