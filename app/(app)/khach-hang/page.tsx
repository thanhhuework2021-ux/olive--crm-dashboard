'use client'

import { useState, useEffect } from 'react'
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

const totalPages = Math.ceil(
  customers.length / ITEMS_PER_PAGE
)

const paginatedCustomers =
  customers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

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
              0
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
            placeholder="Tìm tên, SĐT hoặc Email..."
          />

          <Button variant="outline">
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

paginatedCustomers.map((customer) => (

<tr
  key={customer.id}
  className="border-b border-slate-800"
>

  <td className="p-4">
    {customer.full_name}
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
    {customer.total_spent >= 10000000
      ? 'VIP'
      : 'Thường'}
  </td>

  <td>
  {customer.created_at
    ? new Date(
        customer.created_at
      ).toLocaleDateString('vi-VN')
    : '-'}
</td>

</tr>

))

)}

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

</CardContent>
      </Card>

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
        onClick={() => {
  console.log('Save Customer')
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