'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function CategoryFilter({
  category,
  categories = [],
}: {
  category: string
  categories?: any[]
}) {
  const router = useRouter()
 
  
  return (
    <div className="relative">

        <select
  value={category}
  onChange={(e) => {

  startTransition(() => {

    router.push(
      `/san-pham?category=${encodeURIComponent(
        e.target.value
      )}`
    )

  })

}}

  className="
  h-12
  min-w-[220px]
  cursor-pointer
  appearance-none
  rounded-xl
  border
  border-slate-700
  bg-slate-900
  pl-4
  pr-12
  text-white
  shadow-lg
  shadow-black/20
  transition-all
  duration-200
  hover:border-cyan-500
  hover:bg-slate-800
  focus:border-cyan-500
  focus:outline-none
  focus:ring-2
  focus:ring-cyan-500/20
"
>
  <option value="ALL">
    Tất cả danh mục
  </option>

  {(categories || []).map((item) => (
    <option
      key={item.id}
      value={item.name}
    >
      {item.name}
    </option>
  ))}
</select>

      
     <span
  className="
    pointer-events-none
    absolute
    right-4
    top-1/2
    -translate-y-1/2
    text-slate-400
    transition
  "
>
  ▼
</span>

    </div>
  )
}