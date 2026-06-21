'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export default function ProductsTable({
  products,
}: {
  products: any[]
}) {

const [productList, setProductList] =
  useState(products)

useEffect(() => {
  setProductList(products)
}, [products])

const [search, setSearch] =
  useState('')

  const [quickFilter, setQuickFilter] =
  useState('ALL')

  const [sortBy, setSortBy] =
  useState('NEWEST')

const [currentPage, setCurrentPage] =
  useState(1)

const ITEMS_PER_PAGE = 10

const handleExportExcel = () => {

  const exportData =
    productList.map((item) => ({

      SKU: item.sku,

      'Tên sản phẩm':
        item.name,

      'Danh mục':
        item.category,

      'Màu sắc':
        item.color || '',

      'Giá vốn':
        item.cost_price,

      'Giá bán':
        item.sale_price,

      'Tồn kho':
        item.stock_quantity,

      'Trạng thái':
        item.status,

      'Ngày tạo':
        item.created_at,
    }))

  const worksheet =
    XLSX.utils.json_to_sheet(
      exportData
    )

  const workbook =
    XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Products'
  )

  XLSX.writeFile(
    workbook,
    `products-${new Date()
      .toISOString()
      .slice(0,10)}.xlsx`
  )
}

const [showDeleteModal, setShowDeleteModal] =
  useState(false)

const [selectedProduct, setSelectedProduct] =
  useState<any>(null)

const [viewModal, setViewModal] =
  useState(false)

const [importModal, setImportModal] =
  useState(false)

const [exportModal, setExportModal] =
  useState(false)

const [exportQty, setExportQty] =
  useState('')

const [exportNote, setExportNote] =
  useState('')

const [exportLoading, setExportLoading] =
  useState(false)

const [importQty, setImportQty] =
  useState('')

const [importNote, setImportNote] =
  useState('')

const [importLoading, setImportLoading] =
  useState(false)

const [openMenu, setOpenMenu] =
  useState<string | null>(null)

const filteredProducts =
  productList
    .filter((p) => {

      const matchSearch =
        p.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        p.sku
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      let matchFilter = true

      if (quickFilter === 'ACTIVE') {
        matchFilter =
          p.status === 'active'
      }

      if (quickFilter === 'INACTIVE') {
        matchFilter =
          p.status === 'inactive'
      }

      if (quickFilter === 'LOW_STOCK') {
        matchFilter =
          p.stock_quantity > 0 &&
          p.stock_quantity <= 5
      }

      if (quickFilter === 'OUT_OF_STOCK') {
        matchFilter =
          p.stock_quantity === 0
      }

      return (
        matchSearch &&
        matchFilter
      )
    })
    .sort((a, b) => {

      switch (sortBy) {

        case 'NAME':
          return a.name.localeCompare(
            b.name
          )

        case 'PRICE_ASC':
          return (
            a.sale_price -
            b.sale_price
          )

        case 'PRICE_DESC':
          return (
            b.sale_price -
            a.sale_price
          )

        case 'STOCK_ASC':
          return (
            a.stock_quantity -
            b.stock_quantity
          )

        case 'STOCK_DESC':
          return (
            b.stock_quantity -
            a.stock_quantity
          )

        default:
          return (
            new Date(
              b.created_at
            ).getTime() -
            new Date(
              a.created_at
            ).getTime()
          )

      }

    })

  const startIndex =
  (currentPage - 1) * ITEMS_PER_PAGE

const paginatedProducts =
  filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

const totalPages =
  Math.ceil(
    filteredProducts.length /
    ITEMS_PER_PAGE
  )



  return (
    <>

  <div className="border-b border-slate-800 px-4 py-4">

  <div className="flex items-center gap-3">

    <div className="mb-4 flex justify-end">



</div>

    <input
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      placeholder="Tìm theo tên sản phẩm hoặc SKU..."
      className="
        flex-1
        rounded-xl
        border
        border-slate-700
        bg-slate-900/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm
        px-4
        py-2.5
        outline-none
        transition
        focus:border-cyan-500
        focus:ring-2
        focus:ring-cyan-500/20
      "
    />

    <select
      value={sortBy}
      onChange={(e) =>
        setSortBy(e.target.value)
      }
      className="
        h-[42px]
        w-[140px]
        rounded-xl
        border
        border-slate-700
        bg-slate-900/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm
        px-4
        text-sm
        text-white
        transition
        hover:border-cyan-500
      "
    >
      <option value="NEWEST">
        Mới nhất
      </option>

      <option value="NAME">
        Tên A-Z
      </option>

      <option value="PRICE_ASC">
        Giá tăng dần
      </option>

      <option value="PRICE_DESC">
        Giá giảm dần
      </option>

      <option value="STOCK_ASC">
        Tồn kho tăng dần
      </option>

      <option value="STOCK_DESC">
        Tồn kho giảm dần
      </option>
    </select>

  </div>

</div>

<div className="mt-2 flex items-center justify-between px-4">

  <div className="flex flex-wrap items-center gap-2">

    <button
      onClick={() => setQuickFilter('ALL')}
      className={`h-8 min-w-[80px] rounded-full px-4 font-medium text-sm transition-all duration-300 hover:scale-105 ${
        quickFilter === 'ALL'
          ? 'bg-cyan-500 text-black'
          : 'bg-slate-800'
      }`}
    >
      Tất cả
    </button>

    <button
      onClick={() => setQuickFilter('ACTIVE')}
      className={`h-8 min-w-[80px] rounded-full px-4 font-medium text-sm ${
        quickFilter === 'ACTIVE'
          ? 'bg-green-500 text-black'
          : 'bg-slate-800'
      }`}
    >
      Đang bán
    </button>

    <button
      onClick={() => setQuickFilter('INACTIVE')}
      className={`h-8 min-w-[80px] rounded-full px-4 font-medium text-sm ${
        quickFilter === 'INACTIVE'
          ? 'bg-red-500 text-white'
          : 'bg-slate-800'
      }`}
    >
      Đã ẩn
    </button>

    <button
      onClick={() => setQuickFilter('LOW_STOCK')}
      className={`h-8 min-w-[80px] rounded-full px-4 font-medium text-sm ${
        quickFilter === 'LOW_STOCK'
          ? 'bg-yellow-500 text-black'
          : 'bg-slate-800'
      }`}
    >
      Sắp hết
    </button>

    <button
      onClick={() => setQuickFilter('OUT_OF_STOCK')}
      className={`h-8 min-w-[80px] rounded-full px-4 font-medium text-sm ${
        quickFilter === 'OUT_OF_STOCK'
          ? 'bg-red-700 text-white'
          : 'bg-slate-800'
      }`}
    >
      Hết hàng
    </button>

  </div>

  <button
    onClick={handleExportExcel}
    className="
  h-8
  min-w-[120px]
  rounded-full
  border
  border-cyan-500/40
  bg-cyan-500
  px-4
  text-sm
  font-medium
  text-black
  transition-all
  duration-300

  hover:scale-105
  hover:border-cyan-300
  hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]
  hover:shadow-cyan-500/50

  active:scale-95
"
  >
    📊 Xuất Excel
  </button>

</div>



<div className="mb-5"></div>

<div
  className="
    min-h-[700px]
    flex
    flex-col
    justify-between
  "
>
  <table className="w-full">
  
        <thead className="bg-slate-900/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm">
          <tr>
            <th className="px-4 py-5 text-left text-slate-300 text-sm font-semibold uppercase tracking-wide">Ảnh</th>
            <th className="px-4 py-5 text-left text-slate-300 text-sm font-semibold uppercase tracking-wide">SKU</th>
            <th className="px-4 py-5 text-left text-slate-300 text-sm font-semibold uppercase tracking-wide">Tên sản phẩm</th>
            <th className="px-4 py-5 text-left text-slate-300 text-sm font-semibold uppercase tracking-wide">Danh mục</th>
            
            <th className="px-4 py-5 text-left text-slate-300 text-sm font-semibold uppercase tracking-wide">Màu</th>
            <th className="px-4 py-5 text-left text-slate-300 text-sm font-semibold uppercase tracking-wide">Giá bán</th>
            <th className="px-4 py-5 text-left text-slate-300 text-sm font-semibold uppercase tracking-wide">Tồn kho</th>
            <th className="p-4 text-center">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {paginatedProducts.map((item) => (
            <tr
              key={item.id}
              className="border-t border-slate-800"
            >

              <td className="p-4">
  <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-800">
    {item.image_url ? (
      <img
        src={item.image_url}
        alt={item.name}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full items-center justify-center text-xs text-slate-500">
        No Img
      </div>
    )}
  </div>
</td>
              

              <td className="p-4">
                {item.sku}
              </td>

              <td className="p-4 font-medium">
                {item.name}
              </td>

              <td className="p-4">
                {item.category}
              </td>

      

              <td className="p-4">
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                  {item.color || '-'}
                </span>
              </td>

              <td className="p-4">
                {Number(
                  item.sale_price
                ).toLocaleString('vi-VN')} đ
              </td>

              <td className="p-4">

  {item.stock_quantity === 0 ? (

    <span
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        bg-red-500/20
        px-3
        py-1
        text-sm
        font-semibold
        text-red-400
        ring-1
        ring-red-500/30
      "
    >
      🔴 {item.stock_quantity}
    </span>

  ) : item.stock_quantity <= 5 ? (

    <span
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        bg-yellow-500/20
        px-3
        py-1
        text-sm
        font-semibold
        text-yellow-400
        ring-1
        ring-yellow-500/30
      "
    >
      🟡 {item.stock_quantity}
    </span>

  ) : (

    <span
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        bg-green-500/20
        px-3
        py-1
        text-sm
        font-semibold
        text-green-400
        ring-1
        ring-green-500/30
      "
    >
      🟢 {item.stock_quantity}
    </span>

  )}

</td>

              <td className="relative p-4 text-center">

  <button
    onClick={() =>
      setOpenMenu(
        openMenu === item.id
          ? null
          : item.id
      )
    }
    className="
      rounded-full
      bg-slate-700
      px-3
      py-2
      font-bold
      hover:bg-cyan-500
      hover:text-black
    "
  >
    ⋮
  </button>

 {openMenu === item.id && (
  <div
    className="
      absolute
      top-full
      right-0
      z-[9999]
      mb-2
      w-52
      max-h-[300px]
      overflow-y-auto
      rounded-xl
      border
      border-slate-700
      bg-slate-900
      shadow-2xl
    "
>
       <button
  onClick={() => {
    setSelectedProduct(item)
    setViewModal(true)
    setOpenMenu(null)
  }}
  className="
    block
    w-full
    px-4
    py-3
    text-left
    hover:bg-slate-800
  "
>
  👁️ Xem nhanh
</button>

      <Link
        href={`/san-pham/${item.id}`}
        className="
          block
          px-4
          py-2
          text-left
          hover:bg-slate-800
        "
      >
        ✏️ Sửa
      </Link>

      <button
        onClick={async () => {

          const cloneName =
            `${item.name} COPY`

          const cloneSku =
            `${item.sku}-COPY`

          const { error } =
            await supabase
              .from('products')
              .insert({
                sku: cloneSku,
                name: cloneName,
                category: item.category,
                cost_price: item.cost_price,
                sale_price: item.sale_price,
                stock_quantity: 0,
                image_url: item.image_url,
                status: 'active',
                size: item.size,
                color: item.color,
                sku_master: item.sku_master,
              })

          if (error) {
            alert(error.message)
            return
          }

          window.location.reload()
        }}
        className="
          block
          w-full
          px-4
          py-2
          text-left
          hover:bg-slate-800
        "
      >
        📄 Copy
      </button>

      <button
  onClick={() => {
    setSelectedProduct(item)
    setImportModal(true)
    setOpenMenu(null)
  }}
  className="
    block
    w-full
    px-4
    py-2
    text-left
    hover:bg-slate-800
  "
>
  📥 Nhập kho
</button>

<button
  onClick={() => {
    setSelectedProduct(item)
    setExportModal(true)
    setOpenMenu(null)
  }}
  className="
    block
    w-full
    px-4
    py-2
    text-left
    hover:bg-slate-800
  "
>
  📤 Xuất kho
</button>

      <button
        onClick={() => {
          setSelectedProduct(item)
          setShowDeleteModal(true)
        }}
        className="
          block
          w-full
          px-4
          py-2
          text-left
          text-red-400
          hover:bg-red-500/10
        "
      >
        🚫 Ẩn sản phẩm
      </button>

      <button
  onClick={async () => {

    const confirmDelete =
      confirm(
        `Xóa vĩnh viễn ${item.name}?`
      )

    if (!confirmDelete) return

    const { error } =
      await supabase
        .from('products')
        .delete()
        .eq('id', item.id)

    if (error) {
      alert(error.message)
      return
    }

    alert('Đã xóa sản phẩm')

    window.location.reload()
  }}
  className="
    block
    w-full
    px-4
    py-2
    text-left
    text-red-500
    hover:bg-red-500/10
    border-t
    border-slate-700
  "
>
  🗑️ Xóa vĩnh viễn
</button>

    </div>
  )}

</td>

              
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-center gap-2 border-t border-slate-800 p-4">

  <button
    disabled={currentPage === 1}
    onClick={() =>
      setCurrentPage(currentPage - 1)
    }
    className="rounded-full bg-slate-800 px-4 py-2 disabled:opacity-50"
  >
    ←
  </button>

  {Array.from(
    { length: totalPages },
    (_, i) => (
      <button
        key={i}
        onClick={() =>
          setCurrentPage(i + 1)
        }
        className={`rounded-full px-4 py-2 ${
          currentPage === i + 1
? `
bg-cyan-500
text-black
shadow-lg
shadow-cyan-500/40
`
: 'bg-slate-800'
        }`}
      >
        {i + 1}
      </button>
    )
  )}

 <button
  disabled={
    currentPage === totalPages
  }
>
  →
</button>

</div>

</div>

{showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

    <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm p-6">

      <div className="text-center">

        <div className="mb-3 text-5xl">
          ⚠️
        </div>

        <h2 className="text-xl font-bold">
  {selectedProduct?.status === 'inactive'
    ? 'Khôi phục sản phẩm'
    : 'Ẩn sản phẩm'}
</h2>

        <p className="mt-3 text-slate-400">
  {selectedProduct?.status === 'inactive'
    ? 'Khôi phục sản phẩm:'
    : 'Ẩn sản phẩm:'}
</p>

        <p className="mt-2 font-semibold text-red-400">
          {selectedProduct?.name}
        </p>

      </div>

      <div className="mt-6 flex gap-3">

        <button
          onClick={() => {
            setShowDeleteModal(false)
            setSelectedProduct(null)
          }}
          className="flex-1 rounded-xl border border-slate-700 py-2"
        >
          Hủy
        </button>

        <button
          onClick={async () => {
            
            const { data, error } =
 await supabase
  .from('products')
  .update({
  status:
    selectedProduct.status === 'inactive'
      ? 'active'
      : 'inactive',
})
  .eq('id', selectedProduct.id)
  .select()

            
if (error) {
  alert(error.message)
  return
}

alert(
  selectedProduct.status === 'inactive'
    ? 'Đã khôi phục sản phẩm'
    : 'Đã ẩn sản phẩm'
)

            setProductList(
  productList.filter(
    (p) => p.id !== selectedProduct.id
  )
)

setShowDeleteModal(false)
setSelectedProduct(null)
          }}
          className="flex-1 rounded-xl bg-red-500 py-2 font-semibold text-white"
        >
          {selectedProduct?.status === 'inactive'
  ? 'Khôi phục'
  : 'Ẩn sản phẩm'}
        </button>

      </div>

    </div>

  </div>
)}

{importModal && selectedProduct && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

  <div className="w-full max-w-lg rounded-2xl bg-slate-900 p-6">

    <h2 className="mb-6 text-2xl font-bold">
      Nhập kho nhanh
    </h2>

    <div className="space-y-4">

      <div>

        <label>Tên sản phẩm</label>

        <div>

  <label>Màu sắc</label>

  <input
    disabled
    value={selectedProduct.color || '-'}
    className="mt-2 w-full rounded-lg bg-slate-800 p-3"
  />

</div>

<div>

  <label>Giá vốn</label>

  <input
    disabled
    value={
      Number(
        selectedProduct.cost_price || 0
      ).toLocaleString('vi-VN') + ' đ'
    }
    className="mt-2 w-full rounded-lg bg-slate-800 p-3"
  />

</div>

        <input
          disabled
          value={selectedProduct.name}
          className="mt-2 w-full rounded-lg bg-slate-800 p-3"
        />

      </div>

      <div>

        <label>Tồn hiện tại</label>

        <input
          disabled
          value={selectedProduct.stock_quantity}
          className="mt-2 w-full rounded-lg bg-slate-800 p-3"
        />

      </div>

      <div>

        <label>Số lượng nhập</label>

        <input
          type="number"
          value={importQty}
          onChange={(e) =>
            setImportQty(e.target.value)
          }
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
        />

      </div>

      <div>

        <label>Ghi chú</label>

        <textarea
          value={importNote}
          onChange={(e) =>
            setImportNote(e.target.value)
          }
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
        />

      </div>

    </div>

    <div className="mt-6 flex gap-3">

      <button
        onClick={() => {
          setImportModal(false)
          setImportQty('')
          setImportNote('')
        }}
        className="flex-1 rounded-xl border border-slate-700 py-3"
      >
        Hủy
      </button>

      <button
        disabled={importLoading}
        onClick={async () => {

          if (!importQty) {
            alert('Vui lòng nhập số lượng')
            return
          }

          try {

            setImportLoading(true)

            const qty =
              Number(importQty)

            const newStock =
              selectedProduct.stock_quantity +
              qty

            const { error: updateError } =
              await supabase
                .from('products')
                .update({
                  stock_quantity:
                    newStock,
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
                    'IMPORT',

                  quantity: qty,

                  stock_after:
                    newStock,

                  reference_type:
                    'PURCHASE',

                  reference_id:
                    `PN${Date.now()}`,

                  created_by:
                    'ADMIN',

                  note:
                    importNote,
                })

            if (logError) {
              alert(logError.message)
              return
            }

            window.location.reload()

          } catch (err) {

            console.error(err)
            alert('Có lỗi xảy ra')

          } finally {

            setImportLoading(false)

          }

        }}
        className="flex-1 rounded-xl bg-green-500 py-3 font-semibold text-black"
      >
        {importLoading
          ? 'Đang nhập...'
          : 'Nhập kho'}
      </button>

    </div>

  </div>

</div>

)}

{exportModal && selectedProduct && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

  <div className="w-full max-w-lg rounded-2xl bg-slate-900 p-6">

    <h2 className="mb-6 text-2xl font-bold">
      Xuất kho nhanh
    </h2>

    <div className="space-y-4">

      <div>
        <label>Tên sản phẩm</label>
        <input
          disabled
          value={selectedProduct.name}
          className="mt-2 w-full rounded-lg bg-slate-800 p-3"
        />
      </div>

      <div>
        <label>Màu sắc</label>
        <input
          disabled
          value={selectedProduct.color || '-'}
          className="mt-2 w-full rounded-lg bg-slate-800 p-3"
        />
      </div>

      <div>
        <label>Giá vốn</label>
        <input
          disabled
          value={
            Number(
              selectedProduct.cost_price || 0
            ).toLocaleString('vi-VN') + ' đ'
          }
          className="mt-2 w-full rounded-lg bg-slate-800 p-3"
        />
      </div>

      <div>
        <label>Tồn hiện tại</label>
        <input
          disabled
          value={selectedProduct.stock_quantity}
          className="mt-2 w-full rounded-lg bg-slate-800 p-3"
        />
      </div>

      <div>
        <label>Số lượng xuất</label>
        <input
          type="number"
          value={exportQty}
          onChange={(e) =>
            setExportQty(e.target.value)
          }
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
        />
      </div>

      <div>
        <label>Ghi chú</label>
        <textarea
          value={exportNote}
          onChange={(e) =>
            setExportNote(e.target.value)
          }
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
        />
      </div>

    </div>

    <div className="mt-6 flex gap-3">

      <button
        onClick={() => {
          setExportModal(false)
          setExportQty('')
          setExportNote('')
        }}
        className="flex-1 rounded-xl border border-slate-700 py-3"
      >
        Hủy
      </button>

      <button
        disabled={exportLoading}
        onClick={async () => {

          const qty =
            Number(exportQty)

          if (
            qty <= 0 ||
            qty >
              selectedProduct.stock_quantity
          ) {
            alert(
              'Số lượng xuất không hợp lệ'
            )
            return
          }

          try {

            setExportLoading(true)

            const newStock =
              selectedProduct.stock_quantity -
              qty

            const { error: updateError } =
              await supabase
                .from('products')
                .update({
                  stock_quantity:
                    newStock,
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

                  stock_after:
                    newStock,

                  reference_type:
                    'SALE',

                  reference_id:
                    `PX${Date.now()}`,

                  created_by:
                    'ADMIN',

                  note:
                    exportNote,
                })

            if (logError) {
              alert(logError.message)
              return
            }

            window.location.reload()

          } catch (err) {

            console.error(err)
            alert('Có lỗi xảy ra')

          } finally {

            setExportLoading(false)

          }

        }}
        className="flex-1 rounded-xl bg-orange-500 py-3 font-semibold text-black"
      >
        {exportLoading
          ? 'Đang xuất...'
          : 'Xuất kho'}
      </button>

    </div>

  </div>

</div>

)}



{viewModal && selectedProduct && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

    <div className="w-full max-w-2xl rounded-2xl bg-slate-900/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm/60
backdrop-blur-sm p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Chi tiết sản phẩm
        </h2>

        <button
          onClick={() =>
            setViewModal(false)
          }
          className="text-slate-400"
        >
          ✕
        </button>

      </div>

      <div className="grid grid-cols-2 gap-6">

        <div>

          <img
            src={
              selectedProduct.image_url
            }
            alt={
              selectedProduct.name
            }
            className="
              h-80
              w-full
              rounded-xl
              object-cover
            "
          />

        </div>

        <div className="space-y-3">

          <div>
            <p className="text-slate-400">
              Tên sản phẩm
            </p>

            <p className="font-semibold">
              {selectedProduct.name}
            </p>
          </div>

          <div>
            <p className="text-slate-400">
              SKU
            </p>

            <p>
              {selectedProduct.sku}
            </p>
          </div>

          <div>
            <p className="text-slate-400">
              Danh mục
            </p>

            <p>
              {selectedProduct.category}
            </p>
          </div>

          <div>
            <p className="text-slate-400">
              Màu sắc
            </p>

            <p>
              {selectedProduct.color}
            </p>
          </div>

          <div>
            <p className="text-slate-400">
              Giá vốn
            </p>

            <p>
              {Number(
                selectedProduct.cost_price
              ).toLocaleString('vi-VN')} đ
            </p>
          </div>

          <div>
            <p className="text-slate-400">
              Giá bán
            </p>

            <p className="text-green-400 font-bold">
              {Number(
                selectedProduct.sale_price
              ).toLocaleString('vi-VN')} đ
            </p>
          </div>

          <div>
            <p className="text-slate-400">
              Tồn kho
            </p>

            <p>
              {selectedProduct.stock_quantity}
            </p>
          </div>

        </div>

      </div>

    </div>

  </div>
)}

    </>
  )
}