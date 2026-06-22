'use client'

import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from '@/lib/supabase'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function CustomersPage() {
    const [openCustomer, setOpenCustomer] =
  useState(false)

const [customerName, setCustomerName] =
  useState('')

const [customerPhone, setCustomerPhone] =
  useState('')

const [customerEmail, setCustomerEmail] =
  useState('')

const [customerAddress, setCustomerAddress] =
  useState('')

const [customers, setCustomers] =
  useState<any[]>([])

const [search, setSearch] =
  useState('')

const [dateFilter, setDateFilter] =
  useState('ALL')

const [selectedCustomer, setSelectedCustomer] =
  useState<any>(null)

const [viewModal, setViewModal] =
  useState(false)

  const [editCustomer, setEditCustomer] =
  useState<any>(null)

useEffect(() => {
  loadCustomers()
}, [])

const loadCustomers = async () => {
  const { data } =
    await supabase
      .from('customers')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

  setCustomers(data || [])
}

const ITEMS_PER_PAGE = 10

const [currentPage, setCurrentPage] =
  useState(1)

const filteredCustomers =
  customers.filter((customer) => {

    const keyword =
      search.toLowerCase()

    const matchSearch =
      customer.full_name
        ?.toLowerCase()
        .includes(keyword) ||

      customer.phone
        ?.toLowerCase()
        .includes(keyword) ||

      customer.email
        ?.toLowerCase()
        .includes(keyword)

    if (!matchSearch) return false

    if (
      dateFilter === 'ALL' ||
      !customer.created_at
    )
      return true

    const created =
      new Date(customer.created_at)

    const now = new Date()

    const diffDays =
      Math.floor(
        (now.getTime() -
          created.getTime()) /
          86400000
      )

    switch (dateFilter) {

      case 'TODAY':
        return (
          created.toDateString() ===
          now.toDateString()
        )

      case '7D':
        return diffDays <= 7

      case '30D':
        return diffDays <= 30

      case '90D':
        return diffDays <= 90

      default:
        return true
    }
  })

const totalPages = Math.ceil(
  filteredCustomers.length /
    ITEMS_PER_PAGE
)

const paginatedCustomers =
  filteredCustomers.slice(
    (currentPage - 1) *
      ITEMS_PER_PAGE,
    currentPage *
      ITEMS_PER_PAGE
  )

const currentMonthCustomers =
  customers.filter((c) => {

    if (!c.created_at)
      return false

    const d =
      new Date(c.created_at)

    const now = new Date()

    return (
      d.getMonth() ===
        now.getMonth() &&
      d.getFullYear() ===
        now.getFullYear()
    )
  }).length

const handleExportExcel = () => {

  const worksheet =
    XLSX.utils.json_to_sheet(
      filteredCustomers.map(
        (c) => ({

          Tên: c.full_name,

          SĐT: c.phone,

          Email: c.email,

          Tổng_Đơn:
            c.total_orders,

          Tổng_Chi_Tiêu:
            c.total_spent,

          Ngày_Tạo:
            c.created_at,
        })
      )
    )

  const workbook =
    XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Customers'
  )

  XLSX.writeFile(
    workbook,
    'customers.xlsx'
  )
}

const [deleteCustomer, setDeleteCustomer] =
  useState<any>(null)

const [openMenu, setOpenMenu] =
  useState<string | null>(null)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Khách hàng
          </h1>

          <p className="text-slate-400">
            Quản lý khách hàng và lịch sử mua hàng
          </p>
        </div>

        <Button
  onClick={() =>
    setOpenCustomer(true)
  }
>
  + Thêm khách hàng
</Button>

      </div>

      {/* KPI */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <Card>
          <CardContent className="p-6">
            <p className="text-slate-400">
              Tổng khách hàng
            </p>

            <p className="mt-3 text-4xl font-bold">
              {customers.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-slate-400">
  Khách mới tháng này
</p>

<p className="mt-3 text-4xl font-bold">
  {currentMonthCustomers}
</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-slate-400">
              Khách VIP
            </p>

            <p className="mt-3 text-4xl font-bold">
              {
  customers.filter(
    (c) => c.total_spent >= 10000000
  ).length
}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-slate-400">
              Tổng doanh thu KH
            </p>

            <p className="mt-3 text-4xl font-bold">
              {
  customers
    .reduce(
      (sum, c) =>
        sum +
        Number(
          c.total_spent || 0
        ),
      0
    )
    .toLocaleString('vi-VN')
} đ
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Search */}
      <Card>
        <CardContent className="flex gap-3 p-6">

          <Input
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  placeholder="Tìm tên, SĐT hoặc Email..."
/>

<select
  value={dateFilter}
  onChange={(e) =>
    setDateFilter(
      e.target.value
    )
  }
  className="
    rounded-lg
    border
    border-slate-700
    bg-slate-900
    px-4
  "
>
  <option value="ALL">
    Tất cả
  </option>

  <option value="TODAY">
    Hôm nay
  </option>

  <option value="7D">
    7 ngày
  </option>

  <option value="30D">
    30 ngày
  </option>

  <option value="90D">
    90 ngày
  </option>
</select>

          <Button
  variant="outline"
  onClick={handleExportExcel}
>
  Xuất Excel
</Button>

        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-800">

                <th className="p-4 text-left">
                  STT
                 </th>

                <th className="p-4 text-left">
                  Khách hàng
                </th>

                <th className="p-4 text-left">
                  Số điện thoại
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Tổng đơn
                </th>

                <th className="p-4 text-left">
                  Tổng chi tiêu
                </th>

                <th className="p-4 text-left">
                  Hạng
                </th>

                <th className="p-4 text-left">
                  Ngày Tạo
                </th>  



                <th className="p-4 text-center">
                  Thao tác
                 </th>


              </tr>

            </thead>

           <tbody>

{customers.length === 0 ? (

<tr>
  <td
    colSpan={20}
    className="h-40 text-center text-slate-400"
  >
    Chưa có khách hàng
  </td>
</tr>

) : (

paginatedCustomers.map(
(customer, index) => (

<tr
  key={customer.id}
  className="border-b border-slate-800"
>


<td className="p-4">
  {(currentPage - 1) *
    ITEMS_PER_PAGE +
    index +
    1}
</td>

  <td className="p-4">

  <div className="flex items-center gap-3">

    <div
      className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        bg-cyan-500
        font-bold
        text-black
      "
    >
      {customer.full_name?.charAt(0)}
    </div>

    <div>

      <p className="font-medium">
        {customer.full_name}
      </p>

      <p className="text-xs text-slate-500">
        {customer.phone}
      </p>

    </div>

  </div>

</td>

  <td className="p-4">
    {customer.phone}
  </td>

  <td className="p-4">
    {customer.email || '-'}
  </td>

  <td className="p-4">
    {customer.total_orders}
  </td>

  <td className="p-4">
    {Number(
      customer.total_spent || 0
    ).toLocaleString('vi-VN')} đ
  </td>

  <td className="p-4">

  {customer.total_spent >=
  10000000 ? (

    <span
      className="
        rounded-full
        bg-yellow-500/20
        px-3
        py-1
        text-xs
        font-semibold
        text-yellow-400
      "
    >
      VIP
    </span>

  ) : (

    <span
      className="
        rounded-full
        bg-slate-700
        px-3
        py-1
        text-xs
      "
    >
      THƯỜNG
    </span>

  )}

</td>

  <td>
  {customer.created_at
    ? new Date(
        customer.created_at
      ).toLocaleDateString('vi-VN')
    : '-'}
  </td>

  <td className="relative p-4 text-center">

  <button
    onClick={() =>
      setOpenMenu(
        openMenu === customer.id
          ? null
          : customer.id
      )
    }
    className="
      rounded-full
      bg-slate-800
      px-3
      py-2
      font-bold
      hover:bg-cyan-500
      hover:text-black
    "
  >
    ⋮
  </button>

  {openMenu === customer.id && (

    <div
      className="
        absolute
        right-4
        z-50
        mt-2
        w-40
        overflow-hidden
        rounded-xl
        border
        border-slate-700
        bg-slate-900
        shadow-xl
      "
    >

      <button
        onClick={() => {
          setSelectedCustomer(customer)
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
        👁 Xem
      </button>

      <button
        onClick={() => {
          setEditCustomer(customer)
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
        ✏️ Sửa
      </button>

      <button
        onClick={() => {
          setDeleteCustomer(customer)
          setOpenMenu(null)
        }}
        className="
          block
          w-full
          px-4
          py-3
          text-left
          text-red-400
          hover:bg-red-500/10
        "
      >
        🗑 Xóa
      </button>

    </div>

  )}

</td>



</tr>

))

)}

</tbody>

         </table>

<div className="flex items-center justify-between border-t border-slate-800 p-4">

  <p className="text-sm text-slate-400">

    Hiển thị

    {' '}
    {(currentPage - 1) *
      ITEMS_PER_PAGE +
      1}

    -

    {Math.min(
      currentPage *
        ITEMS_PER_PAGE,
      filteredCustomers.length
    )}

    / {filteredCustomers.length}

    khách hàng

  </p>

  <div className="flex items-center gap-2">

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
            ? 'bg-cyan-500 text-black'
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
    onClick={() =>
      setCurrentPage(currentPage + 1)
    }
    className="rounded-full bg-slate-800 px-4 py-2 disabled:opacity-50"
  >
    →
  </button>

  

</div>

</div>


</CardContent>
      </Card>

{viewModal && selectedCustomer && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

  <div className="w-full max-w-xl rounded-2xl bg-slate-950 p-6">

    <div className="mb-6 flex items-center justify-between">

      <h2 className="text-2xl font-bold">
        Chi tiết khách hàng
      </h2>

      <button
        onClick={() =>
          setViewModal(false)
        }
      >
        ✕
      </button>

    </div>

    <div className="grid gap-4">

      <div>
        <p className="text-slate-400">
          Họ tên
        </p>

        <p className="font-semibold">
          {selectedCustomer.full_name}
        </p>
      </div>

      <div>
        <p className="text-slate-400">
          Số điện thoại
        </p>

        <p>
          {selectedCustomer.phone}
        </p>
      </div>

      <div>
        <p className="text-slate-400">
          Email
        </p>

        <p>
          {selectedCustomer.email || '-'}
        </p>
      </div>

      <div>
        <p className="text-slate-400">
          Địa chỉ
        </p>

        <p>
          {selectedCustomer.address || '-'}
        </p>
      </div>

      <div>
        <p className="text-slate-400">
          Tổng đơn
        </p>

        <p>
          {selectedCustomer.total_orders}
        </p>
      </div>

      <div>
        <p className="text-slate-400">
          Tổng chi tiêu
        </p>

        <p className="font-bold text-green-400">
          {Number(
            selectedCustomer.total_spent || 0
          ).toLocaleString('vi-VN')} đ
        </p>
      </div>

      <div>
        <p className="text-slate-400">
          Ngày tạo
        </p>

        <p>
          {selectedCustomer.created_at
            ? new Date(
                selectedCustomer.created_at
              ).toLocaleDateString('vi-VN')
            : '-'}
        </p>
      </div>

    </div>

  </div>

</div>

)}

{deleteCustomer && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

  <div className="w-[400px] rounded-xl bg-slate-950 p-6">

    <h2 className="mb-4 text-xl font-bold">
      Xóa khách hàng
    </h2>

    <p>
      {deleteCustomer.full_name}
    </p>

    <div className="mt-6 flex gap-2">

      <button
        onClick={() =>
          setDeleteCustomer(null)
        }
        className="flex-1 rounded-lg bg-slate-700 py-3"
      >
        Hủy
      </button>

      <button
        onClick={async () => {

          const { error } =
            await supabase
              .from('customers')
              .delete()
              .eq(
                'id',
                deleteCustomer.id
              )

          if (error) {
            alert(error.message)
            return
          }

          loadCustomers()

          setDeleteCustomer(null)

        }}
        className="flex-1 rounded-lg bg-red-500 py-3"
      >
        Xóa
      </button>

    </div>

  </div>

</div>

)}

{editCustomer && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

  <div className="w-[500px] rounded-xl bg-slate-950 p-6">

    <h2 className="mb-6 text-xl font-bold">
      Sửa khách hàng
    </h2>

    <input
      value={editCustomer.full_name || ''}
      onChange={(e) =>
        setEditCustomer({
          ...editCustomer,
          full_name: e.target.value,
        })
      }
      className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
    />

    <input
      value={editCustomer.phone || ''}
      onChange={(e) =>
        setEditCustomer({
          ...editCustomer,
          phone: e.target.value,
        })
      }
      className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
    />

    <input
      value={editCustomer.email || ''}
      onChange={(e) =>
        setEditCustomer({
          ...editCustomer,
          email: e.target.value,
        })
      }
      className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
    />

    <input
      value={editCustomer.address || ''}
      onChange={(e) =>
        setEditCustomer({
          ...editCustomer,
          address: e.target.value,
        })
      }
      className="mb-6 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
    />

    <div className="flex gap-2">

      <button
        onClick={() =>
          setEditCustomer(null)
        }
        className="flex-1 rounded-lg bg-slate-700 py-3"
      >
        Hủy
      </button>

      <button
        onClick={async () => {

          const { error } =
            await supabase
              .from('customers')
              .update({

                full_name:
                  editCustomer.full_name,

                phone:
                  editCustomer.phone,

                email:
                  editCustomer.email,

                address:
                  editCustomer.address,

              })
              .eq(
                'id',
                editCustomer.id
              )

          if (error) {
            alert(error.message)
            return
          }

          await loadCustomers()

          setEditCustomer(null)

        }}
        className="flex-1 rounded-lg bg-cyan-500 py-3 font-semibold text-black"
      >
        Lưu thay đổi
      </button>

    </div>

  </div>

</div>

)}

{openCustomer && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

  <div className="w-[500px] rounded-xl bg-slate-950 p-6">

    <h2 className="mb-6 text-xl font-bold">
      Thêm khách hàng
    </h2>

    <input
      placeholder="Tên khách hàng"
      value={customerName}
      onChange={(e) =>
        setCustomerName(
          e.target.value
        )
      }
      className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
    />

    <input
      placeholder="Số điện thoại"
      value={customerPhone}
      onChange={(e) =>
        setCustomerPhone(
          e.target.value
        )
      }
      className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
    />

    <input
      placeholder="Email"
      value={customerEmail}
      onChange={(e) =>
        setCustomerEmail(
          e.target.value
        )
      }
      className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
    />

    <input
      placeholder="Địa chỉ"
      value={customerAddress}
      onChange={(e) =>
        setCustomerAddress(
          e.target.value
        )
      }
      className="mb-6 w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
    />

    <div className="flex gap-2">

      <button
        onClick={async () => {

  const { error } =
    await supabase
      .from('customers')
      .insert({

        full_name:
          customerName,

        phone:
          customerPhone,

        email:
          customerEmail,

        address:
          customerAddress,

        total_orders: 0,

        total_spent: 0,
      })

  if (error) {
    alert(error.message)
    return
  }

  await loadCustomers()

  setCustomerName('')
  setCustomerPhone('')
  setCustomerEmail('')
  setCustomerAddress('')

  setOpenCustomer(false)

}}
        className="flex-1 rounded-lg bg-cyan-500 py-3 font-semibold text-black"
      >
        Lưu khách hàng
      </button>

      <button
        onClick={() =>
          setOpenCustomer(false)
        }
        className="flex-1 rounded-lg bg-slate-700 py-3"
      >
        Hủy
      </button>

    </div>

  </div>

</div>

)}

    </div>


  )
}