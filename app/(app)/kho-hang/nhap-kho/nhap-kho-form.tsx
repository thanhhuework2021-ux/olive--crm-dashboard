'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function NhapKhoForm({
  products,
}: {
  products: any[]
}) {
  const [selectedId, setSelectedId] =
    useState('')

    const [quantity, setQuantity] =
  useState('')

const [note, setNote] =
  useState('')

const [loading, setLoading] =
  useState(false)

  const selectedProduct =
    products.find(
      (p) => p.id === selectedId
    )

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

      created_by: 'ADMIN',

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

      <label className="mb-2 block">
        Chọn SKU
      </label>

      <select
        value={selectedId}
        onChange={(e) =>
          setSelectedId(e.target.value)
        }
        className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
      >
        <option value="">
          Chọn sản phẩm
        </option>

        {products.map((p) => (
          <option
            key={p.id}
            value={p.id}
          >
            {p.sku} | {p.name}
          </option>
        ))}
      </select>

      {selectedProduct && (
        <div className="mt-6 grid grid-cols-2 gap-4">

          <div>
            <label>Tên sản phẩm</label>

            <input
              disabled
              value={selectedProduct.name}
              className="mt-2 w-full rounded-lg bg-slate-800 p-3"
            />
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

          <div>
            <label>Màu sắc</label>

            <input
              disabled
              value={
                selectedProduct.color
              }
              className="mt-2 w-full rounded-lg bg-slate-800 p-3"
            />
          </div>

          <div>
            <label>Size</label>

            <input
              disabled
              value={
                selectedProduct.size
              }
              className="mt-2 w-full rounded-lg bg-slate-800 p-3"
            />
          </div>

          <div>
            <label>
              Tồn kho hiện tại
            </label>

            <input
              disabled
              value={
                selectedProduct.stock_quantity
              }
              className="mt-2 w-full rounded-lg bg-slate-800 p-3"
            />
          </div>

        </div>
      )}

    </div>
  )
}