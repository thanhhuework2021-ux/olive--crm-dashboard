'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function CreateOrderSupabase() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [customerName, setCustomerName] =
  useState('')

  const [customerPhone, setCustomerPhone] =
  useState('')

  const [customerAddress, setCustomerAddress] =
  useState('')
  const [cart, setCart] =
  useState<any[]>([])

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .order('sku')

  setProducts(productsData || [])

  setLoading(false)
}

const addToCart = (product: any) => {
  const exists = cart.find(
    (x) => x.id === product.id
  )

  if (exists) {
    setCart(
      cart.map((x) =>
        x.id === product.id
          ? {
              ...x,
              quantity: x.quantity + 1,
            }
          : x
      )
    )
  } else {
    setCart([
      ...cart,
      {
        ...product,
        quantity: 1,
      },
    ])
  }
}

  return (
    <div className="p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">
        Tạo đơn hàng
      </h1>

      <div className="mb-6 rounded-xl border border-slate-800 p-4">

  <h2 className="mb-4 text-lg font-semibold">
    Thông tin khách hàng
  </h2>

  <div className="mb-6 rounded-xl border border-slate-800 p-4">

  <h2 className="mb-4 text-lg font-semibold">
    Giỏ hàng
  </h2>

  {cart.length === 0 ? (
  <p className="text-slate-400">
    Chưa có sản phẩm
  </p>
) : (
  cart.map((item) => (
      <div
        key={item.id}
        className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2"
      >
        <div>
          {item.name}
        </div>

        <div>
          SL: {item.quantity}
        </div>
      </div>
    ))
  )}

</div>

  <div className="grid gap-4 md:grid-cols-3">

    <input
      placeholder="Tên khách hàng"
      value={customerName}
      onChange={(e) =>
        setCustomerName(e.target.value)
      }
      className="rounded-lg border border-slate-700 bg-slate-900 p-3"
    />

    <input
      placeholder="Số điện thoại"
      value={customerPhone}
      onChange={(e) =>
        setCustomerPhone(e.target.value)
      }
      className="rounded-lg border border-slate-700 bg-slate-900 p-3"
    />

    <input
      placeholder="Địa chỉ"
      value={customerAddress}
      onChange={(e) =>
        setCustomerAddress(e.target.value)
      }
      className="rounded-lg border border-slate-700 bg-slate-900 p-3"
    />

  </div>

</div>


      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="grid gap-4">
          {products.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-800 p-4"
            >
              <div className="font-semibold">
                {item.name}
              </div>

              <div className="text-sm text-slate-400">
                {item.sku}
              </div>

              <div>
                Tồn kho: {item.stock_quantity}
              </div>

              <button
  onClick={() => addToCart(item)}
  className="mt-3 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-black"
>
  Thêm vào giỏ
</button>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}