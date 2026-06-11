'use client'

import { useRouter } from 'next/navigation'

export default function CategoryFilter({
  category,
}: {
  category: string
}) {
  const router = useRouter()

  return (
    <select
      value={category}
      onChange={(e) => {
        router.push(
          `/kho-hang/ton-kho?category=${encodeURIComponent(
            e.target.value
          )}`
        )
      }}
      className="
        h-10
        rounded-md
        border
        border-slate-700
        bg-slate-900
        px-3
      "
    >
      <option value="all">
        Tất cả danh mục
      </option>

      <option value="DEN BAN">
        DEN BAN
      </option>

      <option value="DEN CAY">
        DEN CAY
      </option>

      <option value="THAM">
        THAM
      </option>

      <option value="LICH">
        LICH
      </option>
    </select>
  )
}