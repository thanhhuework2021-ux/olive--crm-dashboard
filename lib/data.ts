// ============ TYPES ============

export type OrderStatus =
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'packing'
  | 'shipping'
  | 'completed'
  | 'cancelled'

export type PaymentStatus = 'paid' | 'partial' | 'unpaid'
export type PaymentMethod = 'cash' | 'transfer' | 'card' | 'cod'
export type CustomerTier = 'new' | 'regular' | 'vip' | 'risk'
export type StockStatus = 'in_stock' | 'low' | 'out'

export interface Branch {
  id: string
  name: string
  address: string
}

export interface Staff {
  id: string
  name: string
  role: string
  avatar?: string
}

export interface Product {
  id: string
  sku: string
  barcode: string
  name: string
  category: string
  image: string
  costPrice: number
  sellPrice: number
  stock: number
  reorderLevel: number
  unit: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address: string
  totalOrders: number
  totalSpent: number
  tier: CustomerTier
  lastOrderDate: string
  createdAt: string
}

export interface Supplier {
  id: string
  name: string
  phone: string
  email: string
  address: string
  debt: number
  totalPurchased: number
}

export interface OrderItem {
  productId: string
  sku: string
  name: string
  image: string
  quantity: number
  price: number
  note?: string
}

export interface OrderEvent {
  id: string
  action: string
  staff: string
  time: string
}

export interface Order {
  id: string
  code: string
  customerId: string
  customerName: string
  customerPhone: string
  items: OrderItem[]
  subtotal: number
  discount: number
  vat: number
  shippingFee: number
  total: number
  paid: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  branch: string
  staff: string
  createdAt: string
  shippingCarrier?: string
  trackingCode?: string
  shippingAddress?: string
  note?: string
  history: OrderEvent[]
}

export interface DebtRecord {
  id: string
  customerName: string
  phone: string
  amount: number
  paid: number
  dueDate: string
  status: 'overdue' | 'due_soon' | 'on_track' | 'collected'
}

// ============ STATIC LABELS ============

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  draft: 'Nháp',
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  packing: 'Đang đóng gói',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: 'Đã thanh toán',
  partial: 'Thanh toán một phần',
  unpaid: 'Chưa thanh toán',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Tiền mặt',
  transfer: 'Chuyển khoản',
  card: 'Thẻ',
  cod: 'COD',
}

export const CUSTOMER_TIER_LABELS: Record<CustomerTier, string> = {
  new: 'Khách mới',
  regular: 'Thân thiết',
  vip: 'VIP',
  risk: 'Nguy cơ rời bỏ',
}

export const PRODUCT_CATEGORIES = [
  'Điện thoại',
  'Laptop',
  'Phụ kiện',
  'Đồng hồ',
  'Âm thanh',
  'Máy tính bảng',
]

// ============ DATA ============

//export const branches: Branch[] = [
 // { id: 'b1', name: 'Chi nhánh Quận 1', address: '12 Nguyễn Huệ, Quận 1, TP.HCM' },
  //{ id: 'b2', name: 'Chi nhánh Hà Nội', address: '45 Bà Triệu, Hoàn Kiếm, Hà Nội' },
  //{ id: 'b3', name: 'Chi nhánh Đà Nẵng', address: '88 Lê Duẩn, Hải Châu, Đà Nẵng' },
//]

//export const staffList: Staff[] = [
  //{ id: 's1', name: 'Nguyễn Văn An', role: 'Chủ doanh nghiệp' },
  //{ id: 's2', name: 'Trần Thị Bích', role: 'Quản lý' },
  //{ id: 's3', name: 'Lê Hoàng Cường', role: 'Nhân viên bán hàng' },
  //{ id: 's4', name: 'Phạm Thu Dung', role: 'Nhân viên bán hàng' },
  //{ id: 's5', name: 'Võ Minh Đức', role: 'Nhân viên kho' },
//]

const productSeed: Array<[string, string, number, number, number, string]> = [
  ['iPhone 15 Pro Max 256GB', 'Điện thoại', 27500000, 32990000, 24, 'cái'],
  ['Samsung Galaxy S24 Ultra', 'Điện thoại', 25000000, 29990000, 18, 'cái'],
  ['Xiaomi 14 Pro', 'Điện thoại', 14000000, 17990000, 6, 'cái'],
  ['MacBook Air M3 13"', 'Laptop', 24000000, 28990000, 12, 'cái'],
  ['Dell XPS 13 Plus', 'Laptop', 28000000, 33990000, 4, 'cái'],
  ['Asus ROG Zephyrus G14', 'Laptop', 32000000, 38990000, 0, 'cái'],
  ['AirPods Pro 2', 'Âm thanh', 4800000, 5990000, 56, 'cái'],
  ['Sony WH-1000XM5', 'Âm thanh', 6500000, 8490000, 9, 'cái'],
  ['Apple Watch Series 9', 'Đồng hồ', 8500000, 10990000, 21, 'cái'],
  ['Samsung Galaxy Watch 6', 'Đồng hồ', 5500000, 7490000, 3, 'cái'],
  ['iPad Air M2 11"', 'Máy tính bảng', 14500000, 16990000, 15, 'cái'],
  ['Sạc nhanh Anker 65W', 'Phụ kiện', 450000, 790000, 120, 'cái'],
  ['Ốp lưng MagSafe iPhone 15', 'Phụ kiện', 250000, 590000, 200, 'cái'],
  ['Cáp USB-C Belkin 2m', 'Phụ kiện', 180000, 390000, 2, 'cái'],
  ['Chuột Logitech MX Master 3S', 'Phụ kiện', 1900000, 2590000, 34, 'cái'],
  ['Bàn phím Keychron K8 Pro', 'Phụ kiện', 1600000, 2290000, 0, 'cái'],
]

export const products: Product[] = productSeed.map((p, i) => {
  const [name, category, costPrice, sellPrice, stock, unit] = p
  const reorderLevel = 10
  return {
    id: `p${i + 1}`,
    sku: `SP${String(i + 1).padStart(4, '0')}`,
    barcode: `893${String(1000000 + i * 137).padStart(10, '0')}`,
    name,
    category,
    image: `/products/product-${i + 1}.png`,
    costPrice,
    sellPrice,
    stock,
    reorderLevel,
    unit,
  }
})

export function getStockStatus(p: Product): StockStatus {
  if (p.stock === 0) return 'out'
  if (p.stock <= p.reorderLevel) return 'low'
  return 'in_stock'
}

const customerSeed: Array<[string, string, CustomerTier]> = [
  ['Nguyễn Thị Mai Hương', '0901234567', 'vip'],
  ['Trần Quốc Bảo', '0912345678', 'vip'],
  ['Lê Văn Hùng', '0923456789', 'regular'],
  ['Phạm Thị Thanh', '0934567890', 'regular'],
  ['Hoàng Minh Tuấn', '0945678901', 'new'],
  ['Vũ Thị Lan', '0956789012', 'risk'],
  ['Đặng Văn Khôi', '0967890123', 'regular'],
  ['Bùi Thị Ngọc', '0978901234', 'vip'],
  ['Ngô Gia Bảo', '0989012345', 'new'],
  ['Đỗ Thị Hồng', '0990123456', 'risk'],
  ['Dương Văn Long', '0901112233', 'regular'],
  ['Lý Thị Kim', '0902223344', 'new'],
]

export const customers: Customer[] = customerSeed.map((c, i) => {
  const [name, phone, tier] = c
  const totalOrders =
    tier === 'vip' ? 24 + i : tier === 'regular' ? 8 + i : tier === 'risk' ? 5 : 1 + i
  const avgOrder = tier === 'vip' ? 18000000 : tier === 'regular' ? 6000000 : 2500000
  return {
    id: `c${i + 1}`,
    name,
    phone,
    email: `${name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/\s/g, '')}@gmail.com`,
    address: ['TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'][i % 5],
    totalOrders,
    totalSpent: totalOrders * avgOrder,
    tier,
    lastOrderDate: `2026-0${(i % 5) + 1}-${String((i % 27) + 1).padStart(2, '0')}`,
    createdAt: `2025-0${(i % 9) + 1}-15`,
  }
})

export const suppliers: Supplier[] = [
  { id: 'sup1', name: 'Công ty TNHH Apple Việt Nam', phone: '02838221234', email: 'sales@apple.vn', address: 'Quận 1, TP.HCM', debt: 125000000, totalPurchased: 2400000000 },
  { id: 'sup2', name: 'Samsung Vina Electronics', phone: '02838225678', email: 'b2b@samsung.vn', address: 'Quận 7, TP.HCM', debt: 89000000, totalPurchased: 1800000000 },
  { id: 'sup3', name: 'Digiworld Corporation', phone: '02839009999', email: 'order@digiworld.vn', address: 'Quận 3, TP.HCM', debt: 0, totalPurchased: 950000000 },
  { id: 'sup4', name: 'FPT Trading', phone: '02873007300', email: 'sale@fpt.vn', address: 'Quận 1, TP.HCM', debt: 45000000, totalPurchased: 720000000 },
  { id: 'sup5', name: 'Anker Innovations VN', phone: '02862885566', email: 'wholesale@anker.vn', address: 'Quận Bình Thạnh, TP.HCM', debt: 12000000, totalPurchased: 180000000 },
  { id: 'sup6', name: 'Sony Electronics Vietnam', phone: '02839101010', email: 'trade@sony.vn', address: 'Quận 1, TP.HCM', debt: 0, totalPurchased: 340000000 },
]

// Generate orders
const statuses: OrderStatus[] = ['pending', 'confirmed', 'packing', 'shipping', 'completed', 'completed', 'completed', 'cancelled', 'draft']
const carriers = ['Giao Hàng Nhanh', 'Viettel Post', 'GHTK', 'J&T Express', 'Ninja Van']

function buildOrders(): Order[] {
  const result: Order[] = []
  for (let i = 0; i < 48; i++) {
    const customer = customers[i % customers.length]
    const itemCount = (i % 3) + 1
    const items: OrderItem[] = []
    for (let j = 0; j < itemCount; j++) {
      const prod = products[(i + j) % products.length]
      const qty = (j % 2) + 1
      items.push({
        productId: prod.id,
        sku: prod.sku,
        name: prod.name,
        image: prod.image,
        quantity: qty,
        price: prod.sellPrice,
      })
    }
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0)
    const discount = i % 4 === 0 ? Math.round(subtotal * 0.05) : 0
    const vat = Math.round((subtotal - discount) * 0.08)
    const shippingFee = i % 3 === 0 ? 0 : 30000
    const total = subtotal - discount + vat + shippingFee
    const status = statuses[i % statuses.length]
    const paymentStatus: PaymentStatus =
      status === 'completed' ? 'paid' : status === 'cancelled' ? 'unpaid' : i % 3 === 0 ? 'partial' : 'unpaid'
    const paid = paymentStatus === 'paid' ? total : paymentStatus === 'partial' ? Math.round(total / 2) : 0
    const staff = {
  name: 'ADMIN',
}

const branch = {
  name: 'Kho chính',
}
    const day = String((i % 27) + 1).padStart(2, '0')
    const month = String((i % 5) + 1).padStart(2, '0')
    const dateStr = `2026-${month}-${day}T${String((i % 12) + 8).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:00`

    result.push({
      id: `o${i + 1}`,
      code: `DH${String(2026000 + i + 1)}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      items,
      subtotal,
      discount,
      vat,
      shippingFee,
      total,
      paid,
      status,
      paymentStatus,
      paymentMethod: (['cash', 'transfer', 'card', 'cod'] as PaymentMethod[])[i % 4],
      branch: branch.name,
      staff: staff.name,
      createdAt: dateStr,
      shippingCarrier: carriers[i % carriers.length],
      trackingCode: `VN${String(100000000 + i * 12345)}`,
      shippingAddress: `${(i % 200) + 1} Đường Lê Lợi, ${customer.address}`,
      note: i % 5 === 0 ? 'Giao giờ hành chính, gọi trước khi giao.' : undefined,
      history: [
        { id: 'e1', action: 'Tạo đơn hàng', staff: staff.name, time: dateStr },
        { id: 'e2', action: 'Xác nhận đơn', staff: 'Trần Thị Bích', time: dateStr.replace('T0', 'T1') },
      ],
    })
  }
  return result
}

export const orders: Order[] = buildOrders()

// Debt records
export const debtRecords: DebtRecord[] = customers
  .filter((c) => c.tier === 'vip' || c.tier === 'regular')
  .map((c, i) => {
    const amount = c.totalSpent * 0.08
    const paid = i % 3 === 0 ? amount : i % 3 === 1 ? amount * 0.4 : 0
    const statusArr: DebtRecord['status'][] = ['collected', 'on_track', 'overdue', 'due_soon']
    return {
      id: `d${i + 1}`,
      customerName: c.name,
      phone: c.phone,
      amount,
      paid,
      dueDate: `2026-0${(i % 6) + 1}-${String((i % 27) + 1).padStart(2, '0')}`,
      status: paid >= amount ? 'collected' : statusArr[i % statusArr.length],
    }
  })

// ============ DASHBOARD AGGREGATES ============

export const revenueByDay = Array.from({ length: 30 }, (_, i) => {
  const base = 80000000
  const wave = Math.sin(i / 3) * 25000000
  const trend = i * 1500000
  return {
    date: `${String(i + 1).padStart(2, '0')}/05`,
    revenue: Math.round(base + wave + trend + (i % 7 === 0 ? 30000000 : 0)),
    orders: Math.round(18 + Math.sin(i / 2) * 8 + (i % 7 === 0 ? 12 : 0)),
  }
})

export const revenueByBranch = [
  {
    branch: 'Kho chính',
    revenue: 1240000000,
  },
]

export const topProducts = [
  { name: 'iPhone 15 Pro Max', sold: 142, revenue: 4684580000 },
  { name: 'AirPods Pro 2', sold: 128, revenue: 766720000 },
  { name: 'Samsung Galaxy S24 Ultra', sold: 96, revenue: 2879040000 },
  { name: 'MacBook Air M3', sold: 64, revenue: 1855360000 },
  { name: 'Apple Watch Series 9', sold: 58, revenue: 637420000 },
]

export const topCustomers = [...customers]
  .sort((a, b) => b.totalSpent - a.totalSpent)
  .slice(0, 5)

export const lowStockProducts = products.filter((p) => getStockStatus(p) !== 'in_stock')

export const recentOrders = [...orders]
  .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  .slice(0, 6)

// KPIs
export const kpis = {
  revenueToday: 128450000,
  revenueTodayChange: 12.4,
  revenueMonth: 2840000000,
  revenueMonthChange: 8.7,
  totalOrders: orders.length,
  totalOrdersChange: 5.2,
  newCustomers: 34,
  newCustomersChange: 18.3,
  inventoryValue: products.reduce((s, p) => s + p.costPrice * p.stock, 0),
  inventoryValueChange: -2.1,
  receivable: debtRecords.reduce((s, d) => s + (d.amount - d.paid), 0),
  receivableChange: -6.8,
}
