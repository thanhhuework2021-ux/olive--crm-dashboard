'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { CalendarDays } from 'lucide-react'

import { useState } from 'react'

import { DateRangeDialog } from '@/components/dashboard/date-range-dialog'

interface Props {
  value: string
}

export function DateFilter({
  value,
}: Props) {
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const searchParams = useSearchParams()

function changeRange(range: string) {

 if (range === 'custom') {
  setOpen(true)
  return
}

  const params = new URLSearchParams(searchParams)

  params.set('range', range)

  router.push(`/?${params.toString()}`)
}

  return (
  <>

    <Select
      value={value}
      onValueChange={changeRange}
    >
      <SelectTrigger className="w-[190px]">
        <CalendarDays className="mr-2 h-4 w-4" />
        <SelectValue />
      </SelectTrigger>

      <SelectContent>

        <SelectItem value="today">
          Hôm nay
        </SelectItem>

        <SelectItem value="yesterday">
          Hôm qua
        </SelectItem>

        <SelectItem value="7d">
          7 ngày gần nhất
        </SelectItem>

        <SelectItem value="30d">
          30 ngày gần nhất
        </SelectItem>

        <SelectItem value="custom">
          Tùy chọn...
        </SelectItem>

      </SelectContent>

    </Select>

    <DateRangeDialog
      open={open}
      onOpenChange={setOpen}
    />

  </>
)
}