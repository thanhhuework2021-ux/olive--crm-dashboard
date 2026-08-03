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

  const [paymentMethod, setPaymentMethod] =
  useState('COD')

const [shippingProvider, setShippingProvider] =
  useState('GHN')

const [paidAmount, setPaidAmount] =
  useState(0)

  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] =
    useState('all')

  const [stockFilter, setStockFilter] =
  useState('all')
  const [category, setCategory] = useState('all')
  const [cart, setCart] = useState<CartLine[]>([])
  const [productsData, setProductsData] = useState<any[]>([])
  const [customersData, setCustomersData] = useState<any[]>([])
  const [customer, setCustomer] = useState<any>(null)
  const [customerSearch, setCustomerSearch] = useState('')
  const [customerCode, setCustomerCode] =
  useState('')

  
  

 const [customerName, setCustomerName] =
  useState('')

const [customerPhone, setCustomerPhone] =
  useState('')

const [customerAddress, setCustomerAddress] =
  useState('')

  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('amount')

const [discountValue, setDiscountValue] = useState(0)


useEffect(() => {

  if (
    !customerName ||
    customerPhone.length < 4
  ) {
    setCustomerCode('')
    return
  }

  const lastName =
    customerName
      .trim()
      .split(' ')
      .pop()
      ?.substring(0, 2)
      .toUpperCase() || 'KH'

  const last4Phone =
    customerPhone
      .replace(/\D/g, '')
      .slice(-4)

  const now = new Date()

  const dd =
    String(now.getDate())
      .padStart(2, '0')

  const mm =
    String(now.getMonth() + 1)
      .padStart(2, '0')

  setCustomerCode(
    `KH-${lastName}-${last4Phone}-${dd}${mm}`
  )

}, [
  customerName,
  customerPhone,
])

const [shippingFee, setShippingFee] =
  useState(35000)

  
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

  const matchStock =
    stockFilter === 'all'
      ? true
      : stockFilter === 'active'
      ? Number(p.stock_quantity) > 5
      : stockFilter === 'low'
      ? Number(p.stock_quantity) > 0 &&
        Number(p.stock_quantity) <= 5
      : Number(p.stock_quantity) <= 0

  return (
    matchSearch &&
    matchProduct &&
    matchStock
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

   const subtotal = cart.reduce(
  (s, l) => s + l.price * l.quantity,
  0
)

const discountAmount =
  discountType === 'percent'
    ? Math.round(subtotal * discountValue / 100)
    : discountValue

const total =
  subtotal -
  discountAmount +
  shippingFee

    const findCustomer = async (
  keyword: string
) => {

  if (!keyword?.trim()) return

  const last4 =
    keyword.replace(/\D/g, '').slice(-4)

  console.log(
    'SEARCH CUSTOMER:',
    keyword,
    last4
  )

  const { data, error } =
    await supabase
      .from('customers')
      .select('*')
      .or(
        `customer_display_code.ilike.%${keyword}%,phone.ilike.%${last4}%`
      )
      .limit(1)
      .maybeSingle()

  console.log('CUSTOMER', data)
  console.log('ERROR', error)

  if (!data) return

  setCustomerCode(
    data.customer_display_code || ''
  )

  setCustomerName(
    data.full_name || ''
  )

  setCustomerPhone(
    data.phone || ''
  )

  setCustomerAddress(
    data.address || ''
  )
}


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
       
        const lastName =
  customerName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .split(' ')
    .pop()
    ?.substring(0, 2)
    .toUpperCase() || 'KH'

const last4Phone =
  customerPhone
    .replace(/\D/g, '')
    .slice(-4)

const now = new Date()

const dd =
  String(now.getDate())
    .padStart(2, '0')

const mm =
  String(now.getMonth() + 1)
    .padStart(2, '0')

const customerCode =
  `KH-${lastName}-${last4Phone}-${dd}${mm}`
        
        const {
          data: newCustomer,
          error: customerError,
        } = await supabase
          .from('customers')
          .insert([
            {
  customer_code: customerCode,

  customer_display_code: customerCode,

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


      console.log('ORDER VALUES', {
  total,
  paidAmount,
  remaining:
    Math.max(
      total - paidAmount,
      0
    )
})
const paid =
  Number(paidAmount || 0)

const remaining =
  Math.max(
    Number(total || 0) - paid,
    0
  )

console.log({
  paid,
  remaining,
  total
})

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

      paid_amount: paid,

      remaining_amount: remaining,

      payment_status:
        paid === 0
          ? 'unpaid'
          : paid >= total
          ? 'paid'
          : 'partial',

      status: 'pending',

      payment_method:
        paymentMethod,
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

  sku:
  item.product.sku,

product_name:
  item.product.name,

  color:
    item.product.color,

  quantity:
    item.quantity,

  sale_price:
    item.price,

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
          item.sku
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

          {/* LEFT PANEL */}

<div className="lg:col-span-8 flex flex-col gap-4">

            <div >

              <div className="mb-4 flex gap-3">

                <div className="relative flex-1">

  <Search
    size={15}
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
      rounded-md
      border
      border-slate-700
      bg-slate-900
      py-3
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
      rounded-md
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

               <div className="flex gap-2">

  <button
    onClick={() => setStockFilter('all')}
    className={`rounded-full px-4 py-2 text-sm font-medium ${
      stockFilter === 'all'
        ? 'bg-cyan-500 text-white'
        : 'bg-slate-800 text-slate-300'
    }`}
  >
    Tất cả
  </button>

  <button
    onClick={() => setStockFilter('active')}
    className={`rounded-full px-4 py-2 text-sm font-medium ${
      stockFilter === 'active'
        ? 'bg-green-500 text-white'
        : 'bg-slate-800 text-slate-300'
    }`}
  >
    Còn hàng
  </button>

  <button
    onClick={() => setStockFilter('low')}
    className={`rounded-full px-4 py-2 text-sm font-medium ${
      stockFilter === 'low'
        ? 'bg-yellow-500 text-black'
        : 'bg-slate-800 text-slate-300'
    }`}
  >
    Sắp hết
  </button>

  <button
    onClick={() => setStockFilter('out')}
    className={`rounded-full px-4 py-2 text-sm font-medium ${
      stockFilter === 'out'
        ? 'bg-red-500 text-white'
        : 'bg-slate-800 text-slate-300'
    }`}
  >
    Hết hàng
  </button>

</div>


              </div>

            </div>

       <div
  className="
    -mt-2
    h-[420px]
    overflow-y-auto
    rounded-md
    border
    border-slate-800
    custom-scroll
  "
>

  <div
    className="
      sticky
      top-0
      z-10
      grid
      grid-cols-12
      border-b
      border-slate-700
      bg-slate-950
      px-4
      py-3
      text-xs
      font-bold
      uppercase
      tracking-wide
      text-slate-400
    "
  >
    <div className="col-span-6">
      Sản phẩm
    </div>

    <div className="col-span-3 text-center">
      Giá tiền
    </div>

    <div className="col-span-2 text-center">
      SL
    </div>

    <div className="col-span-1 text-center">
      Thêm SP
    </div>
  </div>

   {displayedProducts.map((item) => (

  <div
  
  key={item.id}
  className="
    grid
    grid-cols-12
    items-center
    border-b
    border-slate-800
    px-4
    py-3
    hover:bg-slate-900/40
  "
>

   <div className="col-span-6 flex items-center gap-4">

  <img
  src={
   item.image_url ||
    '/placeholder-product.png'
  }
  className="
    h-16
    w-16
    rounded-md
    object-cover
  "
/>

<div>

  <div className="font-semibold">
    {item.name}
  </div>

  <div className="mt-1">

  {Number(item.stock_quantity) > 5 && (
    <span className="rounded-full bg-green-500/15 px-2 py-1 text-[10px] text-green-400">
      Còn hàng
    </span>
  )}

  {Number(item.stock_quantity) > 0 &&
   Number(item.stock_quantity) <= 5 && (
    <span className="rounded-full bg-yellow-500/15 px-2 py-1 text-[10px] text-yellow-400">
      Sắp hết
    </span>
  )}

  {Number(item.stock_quantity) <= 0 && (
    <span className="rounded-full bg-red-500/15 px-2 py-1 text-[10px] text-red-400">
      Hết hàng
    </span>
  )}

</div>

  <div className="text-sm text-slate-400">
    {item.sku}
  </div>

</div>

</div>

    <div className="col-span-3 text-center font-semibold text-cyan-400">
      {Number(item.sale_price).toLocaleString('vi-VN')} đ
    </div>

    <div className="col-span-2 flex justify-center">

  <span
    className="
      rounded-full
      bg-cyan-500/20
      border
      border-cyan-500/40
      px-3
      py-1
      text-xs
      font-bold
      text-cyan-300
    "
  >
    {item.stock_quantity}
  </span>

</div>

<div className="col-span-1 flex justify-center">

  <button
    onClick={() => addToCart(item)}
    className="
      h-10
      w-10
      rounded-md
      bg-cyan-500
      text-white
      hover:bg-cyan-400
    "
  >
    +
  </button>

</div>
 

  </div>

))}

</div>

{/* CART */}

<div
 className="
mt-3
rounded-md
border
border-slate-800
bg-slate-900/50
p-3
"
>

  <div className="mb-4 flex items-center justify-between">

  <h2 className="text-xl font-bold">
    Giỏ hàng (
    {cart.reduce(
      (s, item) => s + item.quantity,
      0
    )}
    )
  </h2>

  {cart.length > 0 && (
    <button
      onClick={() => setCart([])}
      className="
        rounded-md
        border
        border-red-500/40
        px-3
        py-2
        text-sm
        text-red-400
        hover:bg-red-500/10
      "
    >
      🗑 Xóa tất cả
    </button>
  )}

</div>

  {cart.length === 0 ? (

    <div className="text-center text-slate-500">
      Chưa có sản phẩm
    </div>

  ) : (

    <div className="space-y-3">

      {cart.map((item) => (

        <div
  key={item.product.id}
  className="
    flex
    items-center
    justify-between
    rounded-md
    border
    border-slate-800
    p-3
  "
>

  <div className="flex items-center gap-4">

    <img
      src={
        item.product.image_url ||
        '/placeholder-product.png'
      }
      className="
        h-16
        w-16
        rounded-md
        object-cover
      "
    />

    <div>

  <div className="font-semibold">
    {item.product.name}
  </div>

  <div className="text-xs text-slate-400">
    {item.product.sku}
  </div>

  <div className="mt-1">

    {item.product.color && (
      <span
        className="
          rounded-full
          bg-cyan-500/15
          px-2
          py-1
          text-[10px]
          text-cyan-300
        "
      >
        {item.product.color}
      </span>
    )}

  </div>

</div>


  </div>

  <div className="text-right">

    <div className="text-cyan-400 font-bold">
      {item.price.toLocaleString('vi-VN')} đ
    </div>

    <div className="text-xs text-slate-400">
      Đơn giá
    </div>

  </div>

  <div className="flex items-center gap-2">

    <button
      onClick={() =>
        updateQty(item.product.id, -1)
      }
      className="rounded bg-slate-700 px-2"
    >
      -
    </button>

    <span>
      {item.quantity}
    </span>

    <button
      onClick={() =>
        updateQty(item.product.id, 1)
      }
      className="rounded bg-slate-700 px-2"
    >
      +
    </button>

  </div>

  <div className="w-32 text-right">

    <div className="font-bold text-green-400">
      {(item.price * item.quantity).toLocaleString('vi-VN')} đ
    </div>

    <div className="text-xs text-slate-400">
      Thành tiền
    </div>

  </div>
  

  <button
    onClick={() =>
      removeLine(item.product.id)
    }
    className="
      rounded
      bg-red-500
      px-3
      py-1
    "
  >
    X
  </button>

</div>

        
      ))}

      <div className="mt-2 border-t pt-2">

        <div className="mt-2 flex justify-between text-[17px] font-semibold">
          <span>Tạm tính</span>
          <span>
            {subtotal.toLocaleString('vi-VN')} đ
          </span>
        </div>

        <div className="mt-2 flex justify-between text-1xl font-bold text-green-400">
          <span>Tổng</span>
          <span>
            {total.toLocaleString('vi-VN')} đ
          </span>
        </div>

      </div>

    </div>

  )}

</div>

</div>

{/* RIGHT SIDEBAR */}

<div className="lg:col-span-4">

  <div
    className="
      rounded-lg
      border
      border-slate-800
      bg-slate-900
      p-5
      shadow-lg
    "
    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
  >

  <div className="space-y-4">
              <h2 className="mb-3 text-1xl font-bold">
  Thông Tin Khách hàng
</h2>

  <div className="relative">

  <input
    placeholder="Mã KH hoặc 4 số cuối SĐT"
    value={customerCode}
    onChange={(e) =>
      setCustomerCode(e.target.value)
    }
    onBlur={() =>
      findCustomer(customerCode)
    }
    className="
      w-full
      rounded-md
      border
      border-cyan-700
      bg-slate-900
      py-2
      px-3
      text-cyan-400
      font-semibold
      placeholder:text-cyan-500/70
    "
  />

</div>

{customerCode && (

  <div
    className="
      mt-2
      inline-flex
      rounded-full
      bg-cyan-500/20
      px-3
      py-1
      text-xs
      font-semibold
      text-cyan-400
    "
  >
    {customerCode}
  </div>

)}

<div className="relative mt-3">

  <User
    size={15}
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
      rounded-md
      border
      border-slate-700
      bg-slate-900
      py-3
      pl-12
      pr-4
    "
  />

</div>

             <div className="relative">

  <Phone
    size={15}
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
      rounded-md
      border
      border-slate-700
      bg-slate-900
      py-3
      pl-12
      pr-4
    "
  />

</div>

              <div className="relative mb-5">

  <MapPin
    size={15}
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
      rounded-md
      border
      border-slate-700
      bg-slate-900
      py-3
      pl-12
      pr-4
    "
  />

</div>

</div>

{/* PAYMENT */}

<div
  className="rounded-md border border-slate-700 bg-slate-900 p-5"
  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
>
  
  <div className="space-y-2">

    <h2 className="mb-2 text-lg font-semibold">
  Thanh toán
</h2>

    {/* Giảm giá */}

   <div>

  <label className="text-xs text-slate-400">
    Giảm giá
  </label>

  <div className="mt-1 flex gap-2">

    <input
      type="number"
      value={discountValue}
      onChange={(e) =>
        setDiscountValue(Number(e.target.value))
      }
      placeholder="0"
      className="
        flex-1
        rounded-md
        border
        border-slate-700
        bg-slate-900
        px-3
        py-2
      "
    />

    <select
      value={discountType}
      onChange={(e) =>
        setDiscountType(
          e.target.value as 'amount' | 'percent'
        )
      }
      className="
        w-24
        rounded-md
        border
        border-slate-700
        bg-slate-900
        px-3
        py-2
      "
    >
      <option value="amount">VNĐ</option>
      <option value="percent">%</option>
    </select>

  </div>

</div>
    {/* Ship */}

    <div>
      <label className="text-xs text-slate-400">
        Phí ship
      </label>

      <input
        type="number"
        value={shippingFee}
        onChange={(e) =>
          setShippingFee(Number(e.target.value))
        }
        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
      />
    </div>

    {/* Thanh toán */}

    <div>
      <label className="text-xs text-slate-400">
        Phương thức thanh toán
      </label>

      <select
        value={paymentMethod}
        onChange={(e) =>
          setPaymentMethod(e.target.value)
        }
        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
      >
        <option value="cash">Tiền mặt</option>
        <option value="bank">Chuyển khoản</option>
        <option value="cod">COD</option>
        <option value="momo">MoMo</option>
      </select>
    </div>

    {/* ĐVVC */}

    <div>
      <label className="text-xs text-slate-400">
        Đơn vị vận chuyển
      </label>

      <select
        value={shippingProvider}
        onChange={(e) =>
          setShippingProvider(e.target.value)
        }
        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
      >
        <option value="GHN">GHN</option>
        <option value="GHTK">GHTK</option>
        <option value="J&T">J&T</option>
        <option value="Viettel">Viettel</option>
      </select>
    </div>

    {/* Đã thu */}
    
  <label className="text-xs text-slate-400">
    Đã thu trước
  </label>

  <input
    type="number"
    value={paidAmount}
    onChange={(e) =>
      setPaidAmount(Number(e.target.value))
    }
    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
  />
</div>

{/* TOTAL */}

<div className="mt-6 rounded-md border border-slate-800 bg-slate-900/40 p-4">
  <div className="flex justify-between">
    <span>Tạm tính</span>
    <span>
      {subtotal.toLocaleString('vi-VN')} đ
    </span>
  </div>

  <div className="mt-3 flex justify-between">
    <span>Giảm giá</span>
    <span>
      {discountAmount.toLocaleString('vi-VN')} đ
    </span>
  </div>

  <div className="mt-3 flex justify-between">
    <span>Phí ship</span>
    <span>
      {shippingFee.toLocaleString('vi-VN')} đ
    </span>
  </div>

  <div className="my-4 border-t border-slate-700" />

  <div className="flex justify-between text-green-400 text-1xl font-bold">
    <span>Thành Tiền</span>
    <span>
      {total.toLocaleString('vi-VN')} đ
    </span>
  </div>

  <div className="flex justify-between text-blue-400 text-1xl font-bold">
    <span>Còn Lại</span>
    <span>
      {Math.max(total - paidAmount, 0).toLocaleString('vi-VN')} đ
    </span>
  </div>

  <button
    onClick={() => setShowConfirm(true)}
    className="
      mt-6
      w-full
      rounded-md
      bg-cyan-500
      py-4
      text-lg
      font-bold
      text-white
    "
  >
    Xác nhận tạo đơn
  </button>

</div>

</div>

</div>

       </div> 
        
        {showConfirm && (

<div
  className="
    fixed
    inset-0
    z-[9999]
    flex
    items-center
    justify-center
    bg-black/70
    p-4
  "
>

 <div
  className="
      w-full
      max-w-[420px]
      rounded-2xl
      border
      border-slate-700
      bg-slate-950
      p-5
      shadow-2xl
"
>

    <h2 className="mb-2 text-center text-xl font-semibold">
      Xác nhận tạo đơn
    </h2>

    <p className="mb-5 text-center text-sm text-slate-400">
      Kiểm tra lại thông tin trước khi tạo đơn hàng
    </p>

              <p className="mb-6 text-center text-slate-300">
                Khách hàng:
                <span className="ml-2 font-semibold">
                  {customerName}
                </span>
              </p>

              <div className="flex gap-2">

                <button
                  onClick={() =>
                    setShowConfirm(false)
                  }
                  className="
flex-1
rounded-md
border
border-slate-600
bg-slate-800
py-2.5
text-sm
font-medium
hover:bg-slate-700
"
                >
                  Hủy
                </button>

                <button
                  onClick={() => {
                    setShowConfirm(false)
                    createOrder()
                  }}
                  className="
flex-1
rounded-md
bg-cyan-500
py-2.5
text-sm
font-semibold
text-white
hover:bg-cyan-600
"
                >
                  Xác nhận
                </button>

              </div>

            </div>

          </div>

        )}

        {showPrint && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

        <div
  className="
    w-[760px]
    rounded-md
    bg-white
    p-10
    text-black
  "
  style={{
   fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '15px',
  lineHeight: '1.5',
}}
>

              {/* HEADER */}

              <div className="pt-2 text-center">

                <h1 className="text-xl font-bold tracking-[3px]">
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

                <div className="mt-2 border-t pt-3">

                  <h2 className="text-base font-bold uppercase">
                    HÓA ĐƠN BÁN HÀNG
                  </h2>

                </div>

              </div>

            

              {/* ORDER INFO */}

<div
  className="mt-3 rounded-md border bg-gray-50 px-4 py-3 text-[13px] leading-5"
  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
>

  <div>
    <strong>Mã đơn:</strong> DH{Date.now()}
  </div>

  <div>
    <strong>Ngày:</strong>{' '}
    {new Date().toLocaleDateString('vi-VN')}
  </div>

  <div>
      <strong>Mã KH:</strong> {customerCode}
    </div>

</div>

{/* CUSTOMER INFO */}

<div
  className="mt-3 rounded-md border bg-gray-50 px-4 py-3 text-[13px] leading-5"
  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
>
  <div className="mb-1 font-bold border-b pb-1">
    THÔNG TIN KHÁCH HÀNG
  </div>

  <div className="grid grid-cols-2 gap-x-6">

   <div>
      <strong>Khách Hàng:</strong> {customerName}
    </div>

    <div className="mt-1">
  <strong>Địa chỉ:</strong> {customerAddress}
</div>

     <div>
      <strong>SĐT:</strong> {customerPhone}
    </div>


    <div>
      <strong>ĐVVC:</strong> {shippingProvider}
    </div>


    <div>
      <strong>Thanh Toán:</strong> {paymentMethod}
    </div>

   

    <div>
      <strong>Đã Thanh Toán:</strong>{' '}
      {paidAmount.toLocaleString('vi-VN')} đ
    </div>

  </div>


</div>

{/* PRODUCTS */}

<table
  className="mt-3 w-full border-collapse text-[14px]"
  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
>
  <thead>

    <tr className="border-b">

      <th className="py-1 text-left">
        SKU
      </th>

      <th className="py-1 text-left">
        Sản phẩm
      </th>

      <th className="py-1 text-center">
        Màu
      </th>

      <th className="py-1 text-center">
        SL
      </th>

      <th className="py-1 text-right">
        Đơn giá
      </th>

      <th className="py-1 text-right">
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

        <td className="py-1">
          {item.product.sku}
        </td>

        <td className="py-1">
          {item.product.name}
        </td>

        <td className="py-1 text-center">
          {item.product.color || '-'}
        </td>

        <td className="py-1 text-center">
          {item.quantity}
        </td>

        <td className="py-1 text-right">
          {item.price.toLocaleString('vi-VN')} đ
        </td>

        <td className="py-1 text-right font-medium">
          {(item.price * item.quantity).toLocaleString('vi-VN')} đ
        </td>

      </tr>

    ))}

  </tbody>

</table>



{/* TOTAL */}

<div className="mt-3 ml-auto w-[320px] p-1 text-[16px]">

  <div className="mt-2 flex justify-between text-[15px] font-semibold">
    <span>Tạm tính</span>
    <span>{subtotal.toLocaleString('vi-VN')} đ</span>
  </div>

  <div className="mt-2 flex justify-between text-[14px] font-normal">
    <span>Giảm giá</span>
    <span>{discountAmount.toLocaleString('vi-VN')} đ</span>
  </div>

 <div className="mt-2 flex justify-between text-[14px] font-normal">
    <span>Phí ship</span>
    <span>{shippingFee.toLocaleString('vi-VN')} đ</span>
  </div>

 <div className="mt-2 flex justify-between text-[14px] font-normal">
    <span>Đã Thanh Toán</span>
    <span>{paidAmount.toLocaleString('vi-VN')} đ</span>
  </div>

  <div className="mt-2 border-t border-black pt-2">

    <div className="mt-2 flex justify-between text-1xl font-bold text-green-600">
      <span>THÀNH TIỀN</span>
      <span>{total.toLocaleString('vi-VN')} đ</span>
    </div>

    <div className="mt-2 flex justify-between text-1xl font-bold text-blue-800">
      <span>CÒN LẠI</span>
      <span>
        {Math.max(total - paidAmount, 0).toLocaleString('vi-VN')} đ
      </span>
    </div>

  </div>

</div>

          
          <div
  className="mt-3 rounded-md border bg-gray-50 px-4 py-3 text-[13px] leading-5"
  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
>

  <div className="mb-2 text-center text-[15px] font-bold">
    CHÍNH SÁCH KIỂM TRA & ĐỔI TRẢ
  </div>

  <p className="mb-1 font-semibold">
    Hỗ trợ đổi trả trong vòng 15 ngày nếu:
  </p>

  <ul className="mb-2 ml-5 list-disc leading-5">
    <li>Sản phẩm giao sai mẫu, sai màu.</li>
    <li>Sản phẩm bị lỗi do nhà sản xuất.</li>
    <li>Sản phẩm hư hỏng trong quá trình vận chuyển.</li>
  </ul>

  <p className="mb-1 font-semibold text-red-600">
    Không áp dụng đổi trả:
  </p>

  <ul className="ml-5 list-disc leading-5">
    <li>Sản phẩm sử dụng sai cách.</li>
    <li>Khách đổi ý sau khi nhận đúng sản phẩm.</li>
    <li>Sản phẩm đã qua sử dụng hoặc bị tác động.</li>
  </ul>

  <div className="mt-3 rounded border bg-blue-50 px-3 py-2 text-[13px] text-blue-700">
    Liên hệ <strong>079 937 9179</strong> để được hỗ trợ về vận đơn và thông tin đơn hàng
  </div>

</div>

              {/* BUTTONS */}

              <div className="no-print mt-6 flex gap-3">

                <button
                  onClick={() => window.print()}
                  className="flex-1 rounded-md bg-green-500 py-3 font-bold text-white"
                >
                  🖨 In hóa đơn
                </button>

                <button
                  onClick={() => setShowPrint(false)}
                  className="flex-1 rounded-md bg-slate-300 py-3 font-bold"
                >
                  Đóng
                </button>
</div>
              </div>
            </div>
            
       
        )}
</div>
      </>

    )
  }
