'use client'

import { useRouter } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function StatusFilter({
  status,
}: {
  status: string
}) {
  const router = useRouter()

  const [isPending, startTransition] =
  useTransition()

  return (
    <div className="relative">
      <select
        value={status}
        
         onChange={(e) => {
  startTransition(() => {
    router.push(
      `/san-pham?status=${e.target.value}`
    )
  })
}}

        className="
          h-12
          appearance-none
          rounded-xl
          border
          border-slate-700
          bg-slate-900
          pl-4
          pr-10
          font-medium
          text-white
          transition
          hover:border-cyan-500
        "
      >
        <option value="ACTIVE">
          Đang bán
        </option>

        <option value="INACTIVE">
          Đã ẩn
        </option>

        <option value="ALL">
          Tất cả
        </option>
      </select>

      <span
        className="
          pointer-events-none
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      >
        ▼
      </span>
    </div>
  )
}