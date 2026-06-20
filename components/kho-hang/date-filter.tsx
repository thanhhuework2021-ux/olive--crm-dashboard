'use client'

import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

export default function DateFilter({
  value,
}: {
  value: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const type =
    searchParams.get('type') || 'all'

  const updateFilter = (
    newRange: string,
    newType: string
  ) => {
    router.push(
      `/kho-hang/lich-su?range=${newRange}&type=${newType}`
    )
  }

  return (
    <div className="flex gap-3">

      <select
        value={value}
        onChange={(e) =>
          updateFilter(
            e.target.value,
            type
          )
        }
        className="
          w-[120px]
          h-11
          rounded-xl
          border
          border-slate-700
          bg-slate-900
          px-4
          text-sm
          text-white
        "
      >
        <option value="all">Tất cả</option>
        <option value="today">Hôm nay</option>
        <option value="yesterday">Hôm qua</option>
        <option value="7">7 ngày</option>
        <option value="30">30 ngày</option>
        <option value="60">60 ngày</option>
      </select>

      <select
        value={type}
        onChange={(e) =>
          updateFilter(
            value,
            e.target.value
          )
        }
        className="
          w-[140px]
          h-11
          rounded-xl
          border
          border-slate-700
          bg-slate-900
          px-4
          text-sm
          text-white
        "
      >
        <option value="all">
          Tất cả loại
        </option>

        <option value="IMPORT">
          Nhập kho
        </option>

        <option value="EXPORT">
          Xuất kho
        </option>

        <option value="SALE">
          Bán hàng
        </option>

      </select>

    </div>
  )
}