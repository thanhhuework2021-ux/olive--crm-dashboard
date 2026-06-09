'use client'

import { useState } from 'react'
import { Search, Bell, Check, Store, ChevronsUpDown } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CommandPalette } from '@/components/command-palette'
import { branches } from '@/lib/data'
import { cn } from '@/lib/utils'

const notifications = [
  { id: 1, title: 'Đơn hàng DH2026001 đã hoàn thành', time: '5 phút trước', unread: true },
  { id: 2, title: 'Sản phẩm "Cáp USB-C Belkin" sắp hết hàng', time: '32 phút trước', unread: true },
  { id: 3, title: 'Khách hàng VIP Trần Quốc Bảo vừa đặt đơn', time: '1 giờ trước', unread: true },
  { id: 4, title: 'Công nợ của Nguyễn Thị Mai Hương đã quá hạn', time: '3 giờ trước', unread: false },
  { id: 5, title: 'Phiếu nhập kho PN0042 đã được duyệt', time: 'Hôm qua', unread: false },
]

export function AppHeader({ title }: { title: string }) {
  const [cmdOpen, setCmdOpen] = useState(false)
  const [branch, setBranch] = useState(branches[0])
  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-xl md:px-5">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-6" />
      <h1 className="hidden text-base font-semibold md:block">{title}</h1>

      <button
        onClick={() => setCmdOpen(true)}
        className="ml-auto flex h-9 w-full max-w-xs items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:ml-4 md:mr-auto"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Tìm kiếm...</span>
        <kbd className="ml-auto hidden items-center gap-0.5 rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] sm:flex">
          Ctrl K
        </kbd>
      </button>

      <div className="flex items-center gap-1.5">
        {/* Branch selector */}
        <Popover>
          <PopoverTrigger
            render={<Button variant="outline" size="sm" />}
            className="hidden gap-2 lg:flex"
          >
            <Store className="size-4 text-primary" />
            <span className="max-w-32 truncate">{branch.name}</span>
            <ChevronsUpDown className="size-3.5 text-muted-foreground" />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-1.5">
            <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Chọn chi nhánh
            </p>
            {branches.map((b) => (
              <button
                key={b.id}
                onClick={() => setBranch(b)}
                className={cn(
                  'flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-accent',
                  branch.id === b.id && 'bg-accent',
                )}
              >
                <Store className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.address}</p>
                </div>
                {branch.id === b.id && (
                  <Check className="mt-0.5 size-4 text-primary" />
                )}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" />}
            className="relative"
          >
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
            <span className="sr-only">Thông báo</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Thông báo</span>
              <Badge variant="secondary" className="text-xs">
                {unreadCount} mới
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {notifications.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className="flex flex-col items-start gap-0.5 py-2.5"
                >
                  <div className="flex w-full items-start gap-2">
                    {n.unread && (
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                    )}
                    <div className={cn(!n.unread && 'pl-4')}>
                      <p className="text-sm leading-snug">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" />}
            className="gap-2 pl-1.5 pr-2"
          >
            <Avatar className="size-7">
              <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                AN
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left leading-tight md:block">
              <p className="text-sm font-medium">Nguyễn Văn An</p>
            </div>
            <Badge
              variant="outline"
              className="hidden border-primary/30 bg-primary/10 text-primary md:inline-flex"
            >
              Chủ DN
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="font-medium">Nguyễn Văn An</p>
              <p className="text-xs font-normal text-muted-foreground">
                an.nguyen@novavi.vn
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Hồ sơ cá nhân</DropdownMenuItem>
            <DropdownMenuItem>Cài đặt tài khoản</DropdownMenuItem>
            <DropdownMenuItem>Trợ giúp & Hỗ trợ</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </header>
  )
}
