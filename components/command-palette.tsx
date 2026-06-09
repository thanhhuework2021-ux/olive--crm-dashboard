'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { navItems } from '@/lib/nav'
import { customers, products, orders } from '@/lib/data'

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  const go = (url: string) => {
    onOpenChange(false)
    router.push(url)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Tìm trang, đơn hàng, khách hàng, sản phẩm..." />
      <CommandList>
        <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
        <CommandGroup heading="Điều hướng">
          {navItems.map((item) => (
            <CommandItem
              key={item.url}
              value={`nav ${item.title}`}
              onSelect={() => go(item.url)}
            >
              <item.icon />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Đơn hàng">
          {orders.slice(0, 5).map((o) => (
            <CommandItem
              key={o.id}
              value={`don ${o.code} ${o.customerName}`}
              onSelect={() => go(`/don-hang?q=${o.code}`)}
            >
              <span className="font-mono text-xs text-primary">{o.code}</span>
              <span>{o.customerName}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Khách hàng">
          {customers.slice(0, 5).map((c) => (
            <CommandItem
              key={c.id}
              value={`kh ${c.name} ${c.phone}`}
              onSelect={() => go('/khach-hang')}
            >
              <span>{c.name}</span>
              <span className="text-muted-foreground text-xs">{c.phone}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Sản phẩm">
          {products.slice(0, 5).map((p) => (
            <CommandItem
              key={p.id}
              value={`sp ${p.name} ${p.sku}`}
              onSelect={() => go('/san-pham')}
            >
              <span className="font-mono text-xs text-muted-foreground">
                {p.sku}
              </span>
              <span>{p.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
