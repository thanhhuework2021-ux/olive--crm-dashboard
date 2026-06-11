'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function OrderReferenceButton({
  referenceId,
    }: {
  referenceId: string
     }) {
  const [open, setOpen] = useState(false)

  const [order, setOrder] = useState<any>(null)

  const [items, setItems] = useState<any[]>([])

  const loadOrder = async () => {

  let result = await supabase
    .from('orders')
    .select(`
      *,
      customers(*)
    `)
    .eq('id', referenceId)
    .single()

  if (!result.data) {
    result = await supabase
      .from('orders')
      .select(`
        *,
        customers(*)
      `)
      .eq('order_code', referenceId)
      .single()
  }

  setOrder(result.data)

  if (result.data?.id) {

    const { data: orderItems } =
      await supabase
        .from('order_items')
        .select(`
          *,
          products(
            name,
            sku
          )
        `)
        .eq('order_id', result.data.id)

    setItems(orderItems || [])
  }
}
  

  return (
  <>
    <button
      onClick={() => {
        setOpen(true)
        loadOrder()
      }}
      className="
        rounded-lg
        bg-slate-800
        px-3
        py-1
        font-mono
        text-cyan-400
        hover:bg-slate-700
      "
    >
      {referenceId}
    </button>

    {open && (
      <div
        className="
          fixed
          inset-0
          z-[9999]
          flex
          items-center
          justify-center
          bg-black/70
        "
      >
        <div
          className="
            w-[700px]
            rounded-2xl
            bg-slate-900
            p-6
          "
        >
          <div className="mb-4 flex justify-between">
            <h2 className="text-xl font-bold">
              Chi tiết hóa đơn
            </h2>

            <button
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">

            <div>
              <span className="text-slate-400">
                Mã đơn:
              </span>

              <div className="font-mono text-cyan-400">
                {order?.order_code}
              </div>
            </div>

            <div>
              <span className="text-slate-400">
                Khách hàng:
              </span>

              <div>
                {order?.customers?.full_name}
              </div>
            </div>

            <div>
              <span className="text-slate-400">
                Tổng tiền:
              </span>

              <div className="font-semibold text-green-400">
                {Number(
                  order?.total_amount || 0
                ).toLocaleString('vi-VN')}đ
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700">

  <p className="mb-3 font-semibold">
    Sản phẩm
  </p>

  <div className="space-y-2">

    {items.map((item) => (

      <div
        key={item.id}
        className="
          flex
          justify-between
          rounded-lg
          bg-slate-800
          px-3
          py-2
        "
      >
        <div>
          <div className="font-medium">
            {item.products?.name}
          </div>

          <div className="text-xs text-slate-400">
            {item.products?.sku}
          </div>
        </div>

        <div className="font-semibold">
          x{item.quantity}
        </div>

      </div>

    ))}

  </div>

</div>

          </div>
        </div>
      </div>
        )}
  </>
  )
}