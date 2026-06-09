'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ProductsTable({
  products,
}: {
  products: any[]
}) {
  const [categoryFilter, setCategoryFilter] =
    useState('ALL')

  const filteredProducts =
    categoryFilter === 'ALL'
      ? products
      : products.filter(
          (p) => p.category === categoryFilter
        )

  return (
    <>
      <div className="mb-4 flex gap-3 p-4">

        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value)
          }
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3"
        >
          <option value="ALL">
            Tất cả danh mục
          </option>

          <option value="DEN BAN">
            Đèn bàn
          </option>

          <option value="DEN CAY">
            Đèn cây
          </option>

          <option value="THAM">
            Thảm
          </option>

          <option value="LICH">
            Lịch
          </option>
        </select>

      </div>

      <table className="w-full">
        <thead className="bg-slate-900">
          <tr>
            <th className="p-4 text-left">Ảnh</th>
            <th className="p-4 text-left">SKU</th>
            <th className="p-4 text-left">Tên sản phẩm</th>
            <th className="p-4 text-left">Danh mục</th>
            <th className="p-4 text-left">Size</th>
            <th className="p-4 text-left">Màu</th>
            <th className="p-4 text-left">Giá bán</th>
            <th className="p-4 text-left">Tồn kho</th>
            <th className="p-4 text-center">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((item) => (
            <tr
              key={item.id}
              className="border-t border-slate-800"
            >
              <td className="p-4">
                <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-800">

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
                {item.size || '-'}
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
                <div className="flex flex-col gap-1">

                  <span>
                    {item.stock_quantity}
                  </span>

                  {item.stock_quantity === 0 ? (
                    <span className="w-fit rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                      Hết hàng
                    </span>
                  ) : item.stock_quantity <= 5 ? (
                    <span className="w-fit rounded-full bg-yellow-500 px-2 py-1 text-xs text-black">
                      Sắp hết
                    </span>
                  ) : (
                    <span className="w-fit rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                      Còn hàng
                    </span>
                  )}

                </div>
              </td>

              <td className="p-4">
                <div className="flex justify-center gap-2">

                  <Link
                    href={`/san-pham/${item.id}`}
                    className="rounded-lg bg-amber-500 px-3 py-1 text-sm text-black"
                  >
                    Sửa
                  </Link>

                  <button
                    className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white"
                  >
                    Xóa
                  </button>

                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}