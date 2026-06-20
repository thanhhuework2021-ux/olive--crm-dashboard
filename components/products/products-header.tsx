'use client'

import Link from 'next/link'

export default function ProductsHeader({
  categoryFilter,
  setCategoryFilter,
}: {
  categoryFilter: string
  setCategoryFilter: (value: string) => void
}) {
  return (
    <div className="mb-6 flex items-start justify-between">

      <div>
        <h1 className="text-3xl font-bold">
          Sản phẩm
        </h1>

        <p className="text-slate-400">
          Quản lý danh mục sản phẩm
        </p>
      </div>

      <div className="flex items-center gap-3">

        <div className="relative">

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            className="
            rounded-xl
            bg-cyan-500
            px-5
            py-3
            font-semibold
            text-black
            transition
            hover:scale-105
              hover:shadow-lg
              hover:shadow-cyan-500/30
            "
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

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
            ▼
          </span>

        </div>

        <Link
          href="/san-pham/them-moi"
          className="
            rounded-xl
            bg-cyan-500
            px-5
            py-3
            font-semibold
            text-black
            transition
            hover:scale-105
          "
        >
          + Thêm sản phẩm
        </Link>

      </div>

    </div>
  )
}