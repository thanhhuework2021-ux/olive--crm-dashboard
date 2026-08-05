'use client'

import type { DateRange } from "react-day-picker"

import { useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

import { Calendar } from '@/components/ui/calendar'

import { useState } from 'react'


interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DateRangeDialog({
  open,
  onOpenChange,
}: Props) {

const router = useRouter()

const [range, setRange] = useState<DateRange | undefined>()

function formatDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")

  return `${y}-${m}-${d}`
}

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent className="max-w-3xl">

        <DialogHeader>

          <DialogTitle>
            Chọn khoảng thời gian
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

  <Calendar
    mode="range"
    selected={range}
    onSelect={setRange}
    numberOfMonths={1}
    className="rounded-xl border p-3"
  />

  <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">

    <div className="space-y-1">

      <p className="text-sm text-muted-foreground">
        Từ ngày
      </p>

      <p className="font-medium">
        {range?.from
          ? range.from.toLocaleDateString("vi-VN")
          : "--"}
      </p>

    </div>

    <div className="space-y-1 text-right">

      <p className="text-sm text-muted-foreground">
        Đến ngày
      </p>

      <p className="font-medium">
        {range?.to
          ? range.to.toLocaleDateString("vi-VN")
          : "--"}
      </p>

    </div>

  </div>

</div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>

          <Button
  onClick={() => {

    if (!range?.from || !range?.to) return

    const from = formatDate(range.from)

const to = formatDate(range.to)

    router.push(
      `/?range=custom&from=${from}&to=${to}`
    )

    onOpenChange(false)

  }}
>
  Áp dụng
</Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  )
}