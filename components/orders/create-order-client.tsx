'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  UserPlus,
  User,
  Phone,
  MapPin,
  Percent,
  Truck,
  X,
  Save,
  Check,
} from 'lucide-react'
import { PageShell, PageHeading } from '@/components/page-shell'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'


interface CartLine {
  product: any
  quantity: number
  price: number
}

export function CreateOrderClient() {

  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] =
    useState('all')
  const [category, setCategory] = useState('all')
  const [cart, setCart] = useState<CartLine[]>([])
  const [productsData, setProductsData] = useState<any[]>([])
  const [customersData, setCustomersData] = useState<any[]>([])
  const [customer, setCustomer] = useState<any>(null)
  const [customerSearch, setCustomerSearch] = useState('')
  const [customerName, setCustomerName] =

    useState('')

  const [customerPhone, setCustomerPhone] =
    useState('')

  const [customerAddress, setCustomerAddress] =
    useState('')

  const [shippingFee, setShippingFee] =
    useState(30000)

  const [discountAmount, setDiscountAmount] =
    useState(0)
  const [payment, setPayment] = useState('cash')
  const [orderNote, setOrderNote] = useState('')
  const [showAllProducts, setShowAllProducts] =
    useState(false)
  const [showPrint, setShowPrint] =
    useState(false)

  const [showConfirm, setShowConfirm] =
  useState(false)

  const filteredProducts = productsData.filter((p) => {

    const matchSearch =
      !search ||
      p.name?.toLowerCase().includes(
        search.toLowerCase()
      ) ||
      p.sku?.toLowerCase().includes(
        search.toLowerCase()
      )

    const matchProduct =
      selectedProduct === 'all' ||
      p.name === selectedProduct

    return (
      matchSearch &&
      matchProduct
    )
  })

  useEffect(() => {
    loadData()
  }, [])

  const displayedProducts =
    showAllProducts
      ? filteredProducts
      : filteredProducts.slice(0, 8)

  const loadData = async () => {
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .order('sku')

    console.log(products)

    const { data: customers } = await supabase
      .from('customers')
      .select('*')
      .order('full_name')

    setProductsData(products || [])
    setCustomersData(customers || [])
  }

  const matchedCustomers = useMemo(
    () =>
      customerSearch
        ? customersData
          .filter(
            (c) =>
              c.full_name
                .toLowerCase()
                .includes(customerSearch.toLowerCase()) ||
              c.phone.includes(customerSearch),
          )
          .slice(0, 4)
        : [],
    [customerSearch, customersData],
  )


  const addToCart = (p: any) => {

  if ((p.stock_quantity || 0) <= 0) {
    toast.error(
      'Sản phẩm đã hết hàng. Vui lòng nhập thêm hàng.'
    )
    return
  }

  setCart((prev) => {

    const existing = prev.find(
      (l) => l.product.id === p.id
    )

    if (existing) {

      if (
        existing.quantity >=
        p.stock_quantity
      ) {
        toast.error(
          'Vui lòng nhập thêm hàng'
        )

        return prev
      }

      return prev.map((l) =>
        l.product.id === p.id
          ? {
              ...l,
              quantity: l.quantity + 1,
            }
          : l
      )
    }

    return [
      ...prev,
      {
        product: p,
        quantity: 1,
        price: p.sale_price,
      },
    ]
  })
}

    const updateQty = (id: string, delta: number) =>
      setCart((prev) =>
        prev
          .map((l) =>
            l.product.id === id
              ? { ...l, quantity: Math.max(0, l.quantity + delta) }
              : l,
          )
          .filter((l) => l.quantity > 0),
      )

    const updatePrice = (id: string, price: number) =>
      setCart((prev) =>
        prev.map((l) => (l.product.id === id ? { ...l, price } : l)),
      )

    const removeLine = (id: string) =>
      setCart((prev) => prev.filter((l) => l.product.id !== id))

    const subtotal = cart.reduce((s, l) => s + l.price * l.quantity, 0)
    const total =
      subtotal -
      discountAmount +
      shippingFee


    const createOrder = async () => {

      console.log('CREATE ORDER')

      if (!cart.length) {
        toast.error('Vui lòng thêm sản phẩm')
        return
      }

      const orderCode =
        'DH' + Date.now()

      let customerId = null

      const { data: existingCustomer } =
        await supabase
          .from('customers')
          .select('*')
          .eq('phone', customerPhone)
          .maybeSingle()

      if (existingCustomer) {
        customerId =
          existingCustomer.id
      } else {

        const {
          data: newCustomer,
          error: customerError,
        } = await supabase
          .from('customers')
          .insert([
            {
              full_name: customerName,
              phone: customerPhone,
              address: customerAddress,
              total_orders: 1,
              total_spent: total,
            },
          ])
          .select()
          .single()

        console.log('customerError', customerError)
        console.log('newCustomer', newCustomer)

        if (customerError) {
          alert(customerError.message)
          return
        }

        if (!newCustomer) {
          alert('newCustomer = null')
          return
        }

        customerId = newCustomer.id
      }

      if (!existingCustomer) {
        await supabase
          .from('customers')
          .insert([
            {
              full_name: customerName,
              phone: customerPhone,
              address: customerAddress,
              total_orders: 1,
              total_spent: total,
            },
          ])
      }

      const {
        data: orderData,
        error,
      } = await supabase
        .from('orders')
        .insert([
          {
            order_code: orderCode,

            customer_id: customerId,

            customer_name: customerName,

            subtotal: subtotal,

            discount: discountAmount,

            shipping_fee: shippingFee,

            total_amount: total,

            status: 'pending',

            payment_method: 'cash',
          },
        ])

        .select()
        .single()

      if (error) {
        console.log(error)
        alert(error.message)
        toast.error(error.message)
        return
      }

      const { error: itemError } =
        await supabase
          .from('order_items')
          .insert(
            cart.map((item) => ({
              customer_name: customerName,
              order_id: orderData.id,
              product_id: item.product.id,
              sku: item.product.sku,
              product_name: item.product.name,
              quantity: item.quantity,
              sale_price: item.price,
              subtotal:
                item.price * item.quantity,
            }))
          )

      console.log('itemError', itemError)
      console.log('orderData', orderData)
      console.log('cart', cart)

      for (const item of cart) {

        const newStock =
          (item.product.stock_quantity || 0) -
          item.quantity

        const { error: stockError } =
          await supabase
            .from('products')
            .update({
              stock_quantity: newStock,
            })
            .eq('id', item.product.id)

        if (stockError) {
          console.error(stockError)
          continue
        }

        console.log(
          'CREATE SALE LOG',
          orderCode,
          item.product.sku
        )

        const { error: logError } =
          await supabase
            .from('inventory_transactions')
            .insert({
              product_id: item.product.id,
              sku: item.product.sku,
              transaction_type: 'SALE',
              quantity: item.quantity,
              stock_after: newStock,
              reference_type: 'ORDER',
              reference_id: orderCode,
              created_by: 'ADMIN',
              note: `Bán hàng - Đơn ${orderCode}`,
            })

        console.log(
          'SALE CREATED',
          orderCode
        )

        if (logError) {
          console.error('LOG ERROR', logError)
          alert(JSON.stringify(logError))
        } else {
          console.log(
            'SALE LOG CREATED',
            orderCode
          )
        }
      }

      toast.success(
        'Tạo đơn hàng thành công'
      )

      setShowPrint(true)

    }

    return (
      <>
        <div className="grid gap-6 lg:grid-cols-12">

          {/* LEFT */}

          <div className="lg:col-span-8">

            <div className="mb-4">

              <div className="mb-4 flex gap-3">

                <div className="relative flex-1">

  <Search
    size={18}
    className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-slate-400
    "
  />

  <input
    placeholder="Tìm SKU hoặc tên sản phẩm..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="
      w-full
      rounded-2xl
      border
      border-slate-700
      bg-slate-900
      py-4
      pl-12
      pr-4
    "
  />

</div>

                <select
                  value={selectedProduct}
                  onChange={(e) =>
                    setSelectedProduct(
                      e.target.value
                    )
                  }
                  className="
      w-64
      rounded-xl
      border
      border-slate-700
      bg-slate-900
      px-3
      py-3
    "
                >
                  <option value="all">
                    Tất cả sản phẩm
                  </option>

                  {[
                    ...new Set(
                      productsData.map(
                        (x) => x.name
                      )
                    ),
                  ].map((name) => (
                    <option
                      key={name}
                      value={name}
                    >
                      {name}
                    </option>
                  ))}
                </select>

              </div>

              <div className="mb-4 flex items-center justify-between">

                <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                  {productsData.length} sản phẩm
                </span>

                {filteredProducts.length > 8 && (

                  <button
                    onClick={() =>
                      setShowAllProducts(!showAllProducts)
                    }
                    className="
      rounded-lg
      border
      border-slate-700
      px-4
      py-2
      text-sm
      hover:border-cyan-500
      "
                  >
                    {showAllProducts
                      ? 'Thu gọn'
                      : 'Xem thêm'}
                  </button>

                )}

              </div>

            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">

              {displayedProducts.map((item) => (

                <div
                  key={item.id}
                  className="
group
rounded-2xl
border
border-slate-800
bg-slate-900/50
p-2
transition-all
hover:border-cyan-500
hover:shadow-xl
hover:shadow-cyan-500/10
"
                >

                  <img
                    src={
                      item.image_url ||
                      '/placeholder-product.png'
                    }
                    alt={item.name}
                    className="
    mb-3
    h-28
    w-full
    rounded-xl
    object-cover
    bg-slate-800
  "
                  />

                  <h3 className="font-medium">
                    {item.name}
                  </h3>

                  <div className="text-sm text-slate-400">
                    {item.sku}
                  </div>

                  <div className="mt-2">

                    {item.stock_quantity > 10 && (
                      <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400">
                        Còn {item.stock_quantity}
                      </span>
                    )}

                   {item.stock_quantity > 0 &&
  item.stock_quantity <= 10 && (
    <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs text-yellow-400">
      Còn {item.stock_quantity}
    </span>
)}

                    {item.stock_quantity === 0 && (
                      <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-400">
                        Hết hàng
                      </span>
                    )}
                    <span
                      className={`
      rounded-full
      px-2
      py-1
      text-xs
      font-medium

      ${item.color === 'RED'
                          ? 'bg-red-500/20 text-red-400'
                          : item.color === 'GREEN'
                            ? 'bg-green-500/20 text-green-400'
                            : item.color === 'YELLOW'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : item.color === 'WHITE'
                                ? 'bg-white/20 text-white'
                                : item.color === 'BLACK'
                                  ? 'bg-slate-700 text-slate-200'
                                  : item.color === 'ORANGE'
                                    ? 'bg-orange-500/20 text-orange-400'
                                    : item.color === 'CREAM'
                                      ? 'bg-amber-100/20 text-amber-200'
                                      : 'bg-cyan-500/20 text-cyan-400'
                        }
    `}
                    >
                      {item.color}
                    </span>

                  </div>


                  <div className="mt-1 text-cyan-400 font-semibold">
                    {Number(item.sale_price).toLocaleString('vi-VN')} đ
                  </div>

                  <Button
                    disabled={
                      (item.stock_quantity || 0) <= 0
                    }
                    onClick={() => addToCart(item)}
                    className={
                      (item.stock_quantity || 0) <= 0
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }
                  >
                    {(item.stock_quantity || 0) <= 0
                      ? 'Hết hàng'
                      : 'Thêm vào giỏ'}
                  </Button>

                </div>

              ))}

              <div className="mt-4 flex justify-center">

              </div>

            </div>

          </div>



          {/* RIGHT */}

          <div className="lg:col-span-4 min-w-[420px]">

            <div className="sticky top-4 h-[calc(100vh-100px)]
overflow-auto space-y-4">



              <h2 className="mb-6 text-3xl font-bold">
  Thông Tin Khách hàng
</h2>

              <div className="relative">

  <User
    size={18}
    className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-slate-400
    "
  />

  <input
    placeholder="Tên khách hàng"
    value={customerName}
    onChange={(e) =>
      setCustomerName(e.target.value)
    }
    className="
      mt-2
      w-full
      rounded-2xl
      border
      border-slate-700
      bg-slate-900
      py-4
      pl-12
      pr-4
    "
  />

</div>

             <div className="relative">

  <Phone
    size={18}
    className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-slate-400
    "
  />

  <input
    placeholder="Số điện thoại"
    value={customerPhone}
    onChange={(e) =>
      setCustomerPhone(e.target.value)
    }
    className="
      mt-2
      w-full
      rounded-2xl
      border
      border-slate-700
      bg-slate-900
      py-4
      pl-12
      pr-4
    "
  />

</div>

              <div className="relative">

  <MapPin
    size={18}
    className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-slate-400
    "
  />

  <input
    placeholder="Địa chỉ"
    value={customerAddress}
    onChange={(e) =>
      setCustomerAddress(e.target.value)
    }
    className="
      mt-2
      w-full
      rounded-2xl
      border
      border-slate-700
      bg-slate-900
      py-4
      pl-12
      pr-4
    "
  />

</div>

              <div className="mt-4">

                <label>
                  Giảm giá
                </label>

                <div className="relative">

  <Percent
    size={18}
    className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-slate-400
    "
  />

  <input
    type="number"
    value={discountAmount}
    onChange={(e) =>
      setDiscountAmount(
        Number(e.target.value)
      )
    }
    className="
      mt-2
      w-full
      rounded-2xl
      border
      border-slate-700
      bg-slate-900
      py-4
      pl-12
      pr-4
    "
  />

</div>

              </div>

              <div className="mt-4">

                <label>
                  Phí ship
                </label>

                <div className="relative">

  <Truck
    size={18}
    className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-slate-400
    "
  />

  <input
    type="number"
    value={shippingFee}
    onChange={(e) =>
      setShippingFee(
        Number(e.target.value)
      )
    }
    className="
      mt-2
      w-full
      rounded-2xl
      border
      border-slate-700
      bg-slate-900
      py-4
      pl-12
      pr-4
    "
  />

</div>

              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">

                <div className="grid grid-cols-12 bg-slate-900 px-2 py-2 text-xs font-semibold text-slate-400">

                  <div className="col-span-2">
                    SKU
                  </div>

                  <div className="col-span-4">
                    Sản phẩm
                  </div>

                  <div className="col-span-2">
                    Màu
                  </div>

                  <div className="col-span-1 text-center">
                    SL
                  </div>

                  <div className="col-span-2 text-right">
                    Tiền
                  </div>

                  <div className="col-span-1 text-right">
                  </div>

                </div>

                {cart.map((item) => (

                  <div
                    key={item.product.id}
                    className="grid grid-cols-12 border-t border-slate-800 px-2 py-3 text-sm"
                  >

                    <div className="col-span-2 text-slate-400">
                      {item.product.sku}
                    </div>

                    <div className="col-span-4">
                      {item.product.name}
                    </div>

                    <div className="col-span-2 text-cyan-400">
                      {item.product.color || '-'}
                    </div>

                    <div className="col-span-1 text-center">
                      {item.quantity}
                    </div>

                    <div className="col-span-2 text-right font-semibold text-green-400">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                    </div>

                    <div className="col-span-1 text-right">

                      <button
                        onClick={() =>
                          removeLine(item.product.id)
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        ✕
                      </button>

                    </div>

                  </div>

                ))}

              </div>


              <div className="mt-8 border-t border-slate-800 pt-6 text-lg">

                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>
                    {subtotal.toLocaleString(
                      'vi-VN'
                    )} đ
                  </span>
                </div>

                <div className="mt-2 flex justify-between">
                  <span>Giảm giá</span>

                  <span>
                    {discountAmount.toLocaleString(
                      'vi-VN'
                    )} đ
                  </span>
                </div>

                <div className="mt-2 flex justify-between">
                  <span>Ship</span>
                  <span>
                    {shippingFee.toLocaleString(
                      'vi-VN'
                    )} đ
                  </span>
                </div>

                <div className="mt-6 flex justify-between text-2xl font-bold text-green-400">

                  <span>
                    Thành tiền
                  </span>

                  <span>
                    {total.toLocaleString(
                      'vi-VN'
                    )} đ
                  </span>

                </div>

              </div>

              <button
                onClick={() =>
                  setShowConfirm(true)
                }
                className="
mt-8
w-full
rounded-2xl
bg-green-500
py-5
text-xl
font-bold
text-black
transition
hover:scale-[1.01]
hover:bg-green-400
"
              >
                Tạo đơn hàng
              </button>

            </div>


          </div>

        </div>

        {showConfirm && (

          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">

            <div className="w-[380px] rounded-2xl bg-slate-900 p-6">

              <h2 className="mb-6 text-center text-lg font-bold">
                Xác nhận tạo đơn hàng
              </h2>

              <p className="mb-6 text-center text-slate-300">
                Khách hàng:
                <span className="ml-2 font-semibold">
                  {customerName}
                </span>
              </p>

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    setShowConfirm(false)
                  }
                  className="flex-1 rounded-xl bg-slate-700 py-3"
                >
                  Hủy
                </button>

                <button
                  onClick={() => {
                    setShowConfirm(false)
                    createOrder()
                  }}
                  className="flex-1 rounded-xl bg-green-500 py-3 font-bold text-black"
                >
                  Xác nhận
                </button>

              </div>

            </div>

          </div>

        )}

        {showPrint && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

            <div className="w-[794px]
rounded-xl
bg-white
p-10
text-black">

              {/* HEADER */}

              <div className="pt-6 text-center">

                <h1 className="text-2xl font-bold tracking-[4px]">
                  OLIVE LIVING
                </h1>

                <div className="mt-2 text-[11px] leading-5 text-gray-600">

                  <div>
                    Địa chỉ: KDC Trung Sơn, Xã Bình Hưng, Hồ Chí Minh
                  </div>

                  <div>
                    Hotline: +84 79 937 9179
                  </div>

                  <div>
                    Email: olivelivingvn@gmail.com
                  </div>

                </div>

                <div className="mt-4 border-t pt-3">

                  <h2 className="text-lg font-bold uppercase">
                    HÓA ĐƠN BÁN HÀNG
                  </h2>

                </div>

              </div>

              {/* ORDER INFO */}

              <div className="mt-4 flex justify-between text-xs">

                <div>
                  <strong>Mã đơn:</strong> DH{Date.now()}
                </div>

                <div>
                  <strong>Ngày:</strong>{' '}
                  {new Date().toLocaleDateString('vi-VN')}
                </div>

              </div>

              {/* CUSTOMER */}

              <div className="mt-4 rounded-lg border p-3 text-xs">

                <div className="mb-2 font-semibold">
                  THÔNG TIN KHÁCH HÀNG
                </div>

                <div>
                  Tên khách hàng: {customerName}
                </div>

                <div>
                  Số điện thoại: {customerPhone}
                </div>

                <div>
                  Địa chỉ: {customerAddress}
                </div>

              </div>

              {/* PRODUCTS */}

              <table className="mt-4 w-full border-collapse text-xs">

                <thead>

                  <tr className="border-b bg-gray-100">

                    <th className="px-2 py-2 text-left">
                      SKU
                    </th>

                    <th className="px-2 py-2 text-left">
                      Sản phẩm
                    </th>

                    <th className="px-2 py-2 text-center">
                      Màu
                    </th>

                    <th className="px-2 py-2 text-center">
                      SL
                    </th>

                    <th className="px-2 py-2 text-right">
                      Đơn giá
                    </th>

                    <th className="px-2 py-2 text-right">
                      Thành tiền
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {cart.map((item) => (

                    <tr
                      key={item.product.id}
                      className="border-b"
                    >

                      <td className="px-2 py-2">
                        {item.product.sku}
                      </td>

                      <td className="px-2 py-2">
                        {item.product.name}
                      </td>

                      <td className="px-2 py-2 text-center">
                        {item.product.color || '-'}
                      </td>

                      <td className="px-2 py-2 text-center">
                        {item.quantity}
                      </td>

                      <td className="px-2 py-2 text-right">
                        {item.price.toLocaleString('vi-VN')} đ
                      </td>

                      <td className="px-2 py-2 text-right font-semibold">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

              {/* TOTAL */}

              <div className="mt-4 ml-auto w-[280px] text-sm">

                <div className="flex justify-between">

                  <span>Tạm tính</span>

                  <span>
                    {subtotal.toLocaleString('vi-VN')} đ
                  </span>

                </div>

                <div className="mt-1 flex justify-between">

                  <span>Giảm giá</span>

                  <span>
                    {discountAmount.toLocaleString('vi-VN')} đ
                  </span>

                </div>

                <div className="mt-1 flex justify-between">

                  <span>Phí ship</span>

                  <span>
                    {shippingFee.toLocaleString('vi-VN')} đ
                  </span>

                </div>

                <div className="mt-2 border-t pt-2">

                  <div className="flex justify-between text-lg font-bold">

                    <span>THÀNH TIỀN</span>

                    <span className="text-green-600">

                      {total.toLocaleString('vi-VN')} đ

                    </span>

                  </div>

                </div>

              </div>

              {/* POLICY */}

              <div className="mt-6 rounded-lg border bg-gray-50 p-4 text-[11px] leading-5">

                <div className="mb-3 text-center font-bold">
                  CHÍNH SÁCH KIỂM TRA & ĐỔI TRẢ
                </div>

                <p>
                  Khách hàng được kiểm tra hàng trước khi thanh toán.
                </p>

                <p className="mt-2 font-semibold">
                  Hỗ trợ đổi trả trong vòng 07 ngày nếu:
                </p>

                <ul className="ml-4 list-disc">

                  <li>Sản phẩm giao sai mẫu, sai màu.</li>

                  <li>Sản phẩm bị lỗi do nhà sản xuất.</li>

                  <li>Sản phẩm hư hỏng trong quá trình vận chuyển.</li>

                </ul>

                <p className="mt-2 font-semibold text-red-600">
                  Không áp dụng đổi trả:
                </p>

                <ul className="ml-4 list-disc">

                  <li>Sản phẩm sử dụng sai cách.</li>

                  <li>Khách đổi ý sau khi nhận đúng sản phẩm.</li>

                  <li>Sản phẩm đã qua sử dụng hoặc bị tác động.</li>

                </ul>

                <div className="mt-2 rounded border bg-blue-50 p-2 text-blue-700">

                  Liên hệ +84 79 937 9179 hoặc
                  olivelivingvn@gmail.com để được hỗ trợ.

                </div>

              </div>

              {/* SIGN */}

              <div className="mt-8 grid grid-cols-2 text-center text-xs">

                <div>

                  <div className="font-semibold">
                    Người bán
                  </div>

                  <div className="mt-12 text-gray-500">
                    (Ký và ghi rõ họ tên)
                  </div>

                </div>

                <div>

                  <div className="font-semibold">
                    Khách hàng
                  </div>

                  <div className="mt-12 text-gray-500">
                    (Ký và ghi rõ họ tên)
                  </div>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="no-print mt-6 flex gap-3">

                <button
                  onClick={() => window.print()}
                  className="flex-1 rounded-lg bg-green-500 py-3 font-bold text-white"
                >
                  🖨 In hóa đơn
                </button>

                <button
                  onClick={() => setShowPrint(false)}
                  className="flex-1 rounded-lg bg-slate-300 py-3 font-bold"
                >
                  Đóng
                </button>

              </div>
            </div>

          </div>

        )}

      </>

    )
  }
