'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CategoriesTable({
  categories,
  countMap,
}: {
  categories: any[]
  countMap: Record<string, number>
}) {

    const [openMenu, setOpenMenu] =
  useState<string | null>(null)

  const [editModal, setEditModal] =
  useState(false)

const [selectedCategory, setSelectedCategory] =
  useState<any>(null)

const [editName, setEditName] =
  useState('')

  return (
  <>
    <table className="w-full">

      <thead className="bg-slate-900">
        <tr>
          <th className="p-4 text-left">
            Tên danh mục
          </th>

          <th className="p-4 text-left">
            Mã
          </th>

          <th className="p-4 text-center">
            Sản phẩm
          </th>

          <th className="p-4 text-center">
            Trạng thái
          </th>

          <th className="p-4 text-center">
            Ngày tạo
          </th>

          <th className="p-4 text-center">
            Thao tác
          </th>
        </tr>
      </thead>

      <tbody>
        {categories.map((item) => (
          <tr
            key={item.id}
            className="border-t border-slate-800 hover:bg-slate-900/40 transition"
          >
            <td className="p-4 font-medium">
              {item.name}
            </td>

            <td className="p-4">
              {item.code}
            </td>

            <td className="p-4 text-center">
              {countMap[item.name] || 0}
            </td>

            <td className="p-4 text-center">
              {item.status === 'active' ? (
                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    bg-green-500/20
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-green-400
                    ring-1
                    ring-green-500/30
                  "
                >
                  ● Đang bán
                </span>
              ) : (
                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    bg-red-500/20
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-red-400
                    ring-1
                    ring-red-500/30
                  "
                >
                  ● Đã ẩn
                </span>
              )}
            </td>

            <td className="p-4 text-center text-slate-400">
              {new Date(
                item.created_at
              ).toLocaleDateString('vi-VN')}
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
      rounded-lg
      bg-slate-700
      px-4
      py-2
      text-sm
      font-medium
      transition-all
      hover:bg-cyan-500
      hover:text-black
    "
  >
    Quản lý
  </button>

  {openMenu === item.id && (
    <div
      className="
        absolute
        right-6
        z-50
        mt-2
        w-48
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
    setSelectedCategory(item)
    setEditName(item.name)
    setEditModal(true)
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
  ✏️ Sửa tên
</button>

      <button
  onClick={() => {
    window.location.href =
      `/san-pham?category=${item.name}`
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
  👁️ Xem sản phẩm
</button>

      {item.status === 'active' ? (

  <button
    onClick={async () => {

      const ok = confirm(
        `Ẩn danh mục ${item.name}?`
      )

      if (!ok) return

      const { count } =
        await supabase
          .from('products')
          .select('*', {
            count: 'exact',
            head: true,
          })
          .eq('category', item.name)
          .eq('status', 'active')

      if ((count || 0) > 0) {
        alert(
          `Danh mục còn ${count} sản phẩm đang bán`
        )
        return
      }

      const { error } =
        await supabase
          .from('categories')
          .update({
            status: 'inactive',
          })
          .eq('id', item.id)

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
      py-3
      text-left
      text-red-400
      hover:bg-red-500/10
    "
  >
    🚫 Ẩn danh mục
  </button>

) : (

  <button
    onClick={async () => {

      const { error } =
        await supabase
          .from('categories')
          .update({
            status: 'active',
          })
          .eq('id', item.id)

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
      py-3
      text-left
      text-green-400
      hover:bg-green-500/10
    "
  >
    ✅ Kích hoạt lại
  </button>

)}

    </div>
  )}

</td>
          </tr>
        ))}
      </tbody>

</table>

{editModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

    <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6">

      <h2 className="mb-4 text-xl font-bold">
        Sửa danh mục
      </h2>

      <input
        value={editName}
        onChange={(e) =>
          setEditName(e.target.value)
        }
        className="
          w-full
          rounded-xl
          border
          border-slate-700
          bg-slate-800
          p-3
          text-white
        "
      />

      <div className="mt-4 flex gap-3">

        <button
          onClick={() =>
            setEditModal(false)
          }
          className="
            flex-1
            rounded-xl
            border
            border-slate-700
            py-3
          "
        >
          Hủy
        </button>

        <button
          onClick={async () => {

            const oldName =
  selectedCategory.name

const newName =
  editName.toUpperCase()

const { error } =
  await supabase
    .from('categories')
    .update({
      name: newName,
    })
    .eq('id', selectedCategory.id)

if (error) {
  alert(error.message)
  return
}

await supabase
  .from('products')
  .update({
    category: newName,
  })
  .eq('category', oldName)

window.location.reload()

            if (error) {
              alert(error.message)
              return
            }

            window.location.reload()
          }}
          className="
            flex-1
            rounded-xl
            bg-cyan-500
            py-3
            font-semibold
            text-black
          "
        >
          Lưu
        </button>

      </div>

    </div>

  </div>
)}

</>
  )
}