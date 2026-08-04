'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Zap } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { navItems } from '@/lib/nav'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = (url: string) =>
    url === '/' ? pathname === '/' : pathname === url

  const isParentActive = (item: (typeof navItems)[number]) =>
    item.items?.some((s) => pathname === s.url) ?? false

  const [userEmail, setUserEmail] = useState('')

useEffect(() => {

  const loadUser = async () => {

    try {

      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUserEmail(
        user?.email || ''
      )

    } catch (err) {

      console.error(
        'SUPABASE AUTH ERROR',
        err
      )

      setUserEmail('')

    }

  }

  loadUser()

}, [])

  return (
    
<Sidebar
  collapsible="icon"
  className="min-w-[290px] max-w-[290px]"
>

     <SidebarHeader className="border-b border-slate-800 px-5 py-5">
  <Link
    href="/"
    className="flex items-center gap-4"
  >
    <div
      className="
      flex
      h-12
      w-12
      items-center
      justify-center
      rounded-xl
      bg-cyan-500
      text-white
      shadow-lg
      shadow-cyan-500/20
    "
    >
      <Zap className="h-6 w-6" />
    </div>

    <div>
      <h2 className="text-2xl font-black tracking-wide">
        OLIVE LIVING
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        Quản lý bán hàng
      </p>
    </div>
  </Link>
</SidebarHeader>

      <SidebarContent className="px-4 pt-6 pb-5">
        <SidebarMenu className="space-y-3">
          {navItems.map((item) => {
            if (!item.items) {
              return (
                <SidebarMenuItem key={item.url}>

                  <SidebarMenuButton
  render={<Link href={item.url} />}
  isActive={isActive(item.url)}
  tooltip={item.title}
className="
min-h-[56px]
rounded-xl
px-5
py-4
text-base
font-semibold
gap-4
transition-all
duration-200
hover:bg-slate-800
"
>

                    <item.icon className="h-6 w-6 shrink-0" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }

            return (
             <Collapsible
  key={item.url}
  render={<SidebarMenuItem />}
  defaultOpen={isParentActive(item)}
  className="group/collapsible"
>

                <CollapsibleTrigger
                  render={
  <SidebarMenuButton
    tooltip={item.title}
    isActive={isParentActive(item)}
    className="
      h-12
      rounded-xl
      px-4
      text-base
font-semibold
      transition-all
      duration-200
      hover:bg-slate-800
      hover:translate-x-1
      data-[active=true]:bg-cyan-500/15
      data-[active=true]:border
      data-[active=true]:border-cyan-500/30
      data-[active=true]:text-cyan-400
      min-h-[56px]
py-4
gap-4
    "
  />
}
                >
                  <item.icon className="h-6 w-6 shrink-0" />
                  <span>{item.title}</span>
                 <ChevronRight
  className="
    ml-auto
    h-4
    w-4
    text-slate-500
    transition-transform
    duration-200
    group-data-[panel-open]/collapsible:rotate-90
  "
/>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub
  className="
    mt-3
    ml-4
    rounded-xl
    border
    border-slate-800
    bg-slate-900/70
    p-2
    space-y-2
  "
>
                    {item.items.map((sub) => (
                      <SidebarMenuSubItem key={sub.url}>
                        <SidebarMenuSubButton
                          render={<Link href={sub.url} />}
                          isActive={pathname === sub.url}
                          className="
h-11
rounded-lg
px-4
text-[15px]
font-medium
transition-all
duration-200
hover:bg-slate-800
"
                        >
                          {sub.icon && <sub.icon />}
                          <span>{sub.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="space-y-3">
          <SidebarMenuItem>
           <SidebarMenuButton
  size="lg"
  className="
    rounded-xl
    border
    border-slate-800
    bg-slate-950
    p-3
    cursor-default
  "
>
              <Avatar className="h-12 w-12 rounded-xl">
                <AvatarFallback className="rounded-lg bg-primary/15 text-primary text-xs font-semibold">
                  
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left leading-tight">
                <span className="truncate text-sm font-medium">
  {userEmail.split('@')[0] || 'User'}
</span>
                <span className="truncate text-xs text-muted-foreground">
  {userEmail}
</span>
              </div>
            </SidebarMenuButton>
            
           <button
  onClick={async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }}
  className="
mt-3
h-11
w-full
rounded-xl
border
border-red-500/20
bg-red-500/5
text-sm
font-semibold
text-red-400
transition-all
duration-200
hover:bg-red-500/15
"
>
  🚪 Đăng xuất
</button>

          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
