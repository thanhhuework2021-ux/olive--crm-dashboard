'use client'

import {
  useState,
  useEffect,
} from 'react'

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

    const [quantity, setQuantity] =
  useState('')

const [note, setNote] =
  useState('')

const [loading, setLoading] =
  useState(false)

const [search,setSearch] =
  useState('')

  const selectedProduct =
    products.find(
      (p) => p.id === selectedId
    )

  const variants =
  products.filter(
    (p) =>
      p.name === selectedName
  )

  const filteredProducts =
  products.filter((p) =>
    p.name
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )
  )

  useEffect(() => {
  if (variants.length > 0) {
    setSelectedId(
      variants[0].id
    )
  }
}, [selectedName])

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

<div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">

  {[
    ...new Map(
      products
        .filter((p) =>
          p.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
        )
        .map((p) => [
          p.name,
          p,
        ])
    ).values(),

  ]
.slice(
  0,
  showAll ? 999 : 8
)
.map((item) => (

    <button
      key={item.name}
      type="button"
      onClick={() => {
        setSelectedName(
          item.name
        )
      }}
      className="
        rounded-xl
        border
        border-slate-700
        bg-slate-900
        p-4
        text-left
        transition
        hover:border-cyan-500
      "
    >

      <div className="font-semibold">
        {item.name}
      </div>

    </button>

  ))}

  </div>

      {selectedProduct && (
         

        <div className="mt-6 space-y-6">

          <div>
            <label>Tên sản phẩm</label>

            <input
              disabled
              value={selectedProduct.name}
              className="mt-2 w-full rounded-lg bg-slate-800 p-3"
            />
          </div>

          <div className="col-span-2">

  <div className="mb-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

    <img
  src={
    selectedProduct.image_url ||
    '/placeholder-product.png'
  }
  alt={selectedProduct.name}
  className="
    h-64
    w-64
    rounded-xl
    object-cover
    border
    border-slate-700
  "
/>

  </div>

</div>

          <div className="mt-4 grid grid-cols-2 gap-3">
  {products
    .filter(
      (x) =>
        x.name === selectedProduct?.name
    )
    .map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() =>
          setSelectedId(item.id)
        }
        className={`
          rounded-xl
          border
          p-4
          text-left

          ${
            selectedId === item.id
              ? 'border-cyan-500 bg-cyan-500/10'
              : 'border-slate-700'
          }
        `}
      >
        <div className="font-semibold">
          {item.color}
        </div>

        <div className="text-sm text-slate-400">
          {item.sku}
        </div>

        <div className="mt-2 text-green-400">
          Tồn:
          {item.stock_quantity}
        </div>
      </button>
    ))}
</div>

          <div className="col-span-2 mt-4">

  <label>Số lượng nhập</label>

  <input
    type="number"
    value={quantity}
    onChange={(e) =>
      setQuantity(e.target.value)
    }
    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
  />

</div>

<div className="col-span-2">

  <label>Ghi chú</label>

  <textarea
    value={note}
    onChange={(e) =>
      setNote(e.target.value)
    }
    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
  />

</div>

<div className="col-span-2">

  <button
    onClick={handleImport}
    disabled={loading}
    className="rounded-lg bg-green-500 px-6 py-3 font-semibold text-black"
  >
    {loading
      ? 'Đang nhập...'
      : 'Nhập kho'}
  </button>

</div>

        </div>
      )}

    </div>
  )
}