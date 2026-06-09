'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function XuatKhoForm({
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

  const handleExport = async () => {
    if (!selectedProduct) {
      alert('Vui lòng chọn sản phẩm')
      return
    }

    const qty = Number(quantity)

    if (qty <= 0) {
      alert('Số lượng không hợp lệ')
      return
    }

    if (
      qty >
      selectedProduct.stock_quantity
    ) {
      alert('Không đủ tồn kho')
      return
    }

    try {
      setLoading(true)

      const newStock =
        selectedProduct.stock_quantity - qty

      const { error: updateError } =
        await supabase
          .from('products')
          .update({
            stock_quantity: newStock,
          })
          .eq(
            'id',
            selectedProduct.id
          )

      if (updateError) {
        alert(updateError.message)
        return
      }

      const { error: logError } =
        await supabase
          .from(
            'inventory_transactions'
          )
          .insert({
            product_id:
              selectedProduct.id,

            sku:
              selectedProduct.sku,

            transaction_type:
              'EXPORT',

            quantity: qty,

            stock_after: newStock,

            reference_type:
              'MANUAL_EXPORT',

            reference_id:
              `PX${Date.now()}`,

            created_by: 'ADMIN',

            note,
          })

      if (logError) {
        alert(logError.message)
        return
      }

      alert('Xuất kho thành công')

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
            <label>
              Tên sản phẩm
            </label>

            <input
              disabled
              value={
                selectedProduct.name
              }
              className="mt-2 w-full rounded-lg bg-slate-800 p-3"
            />
          </div>

          <div>
            <label>
              Màu sắc
            </label>

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

          <div className="col-span-2">
            <label>
              Số lượng xuất
            </label>

            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
            />
          </div>

          <div className="col-span-2">
            <label>Ghi chú</label>

            <textarea
              value={note}
              onChange={(e) =>
                setNote(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
            />
          </div>

          <div className="col-span-2">
            <button
              onClick={handleExport}
              disabled={loading}
              className="rounded-lg bg-red-500 px-6 py-3 font-semibold text-white"
            >
              {loading
                ? 'Đang xuất...'
                : 'Xuất kho'}
            </button>
          </div>

        </div>
      )}
    </div>
  )
}