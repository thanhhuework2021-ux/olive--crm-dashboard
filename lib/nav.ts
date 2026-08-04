import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Building2,
  Warehouse,
  Wallet,
  BarChart3,
  Settings,
  ListOrdered,
  PlusCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  items?: { title: string; url: string; icon?: LucideIcon }[]
}

export const navItems: NavItem[] = [
  
  {
    title: 'Tổng quan',
    url: '/',
    icon: LayoutDashboard,
  },

  {
    title: 'Đơn hàng',
    url: '/don-hang',
    icon: ShoppingCart,
    items: [
      {
        title: 'Danh sách đơn hàng',
        url: '/don-hang',
        icon: ListOrdered,
      },
      {
        title: 'Tạo đơn hàng mới',
        url: '/don-hang/tao-moi',
        icon: PlusCircle,
      },
    ],
  },

  {
    title: 'Khách hàng',
    url: '/khach-hang',
    icon: Users,
  },

  {
  title: 'Sản phẩm',
  url: '/san-pham',
  icon: Package,
  items: [
    {
      title: 'Danh sách sản phẩm',
      url: '/san-pham',
    },
    {
      title: 'Danh mục',
      url: '/danh-muc',
    },
    {
      title: 'Thêm sản phẩm',
      url: '/san-pham/them-moi',
    },
  ],
},

  //{
    //title: 'Nhà cung cấp',
   // url: '/nha-cung-cap',
    //icon: Building2,
 // },

  {
  title: 'Kho hàng',
  url: '/kho-hang',
  icon: Warehouse,
  items: [
    {
      title: 'Tồn kho',
      url: '/kho-hang/ton-kho',
    },
    {
      title: 'Nhập kho',
      url: '/kho-hang/nhap-kho',
    },
    /*
    {
      title: 'Xuất kho',
      url: '/kho-hang/xuat-kho',
    },
    */
    {
      title: 'Lịch sử kho',
      url: '/kho-hang/lich-su',
    },
  ],
},
/*
{
  title: 'Công nợ',
  url: '/cong-no',
  icon: Wallet,
},
*/
 /* {
    title: 'Báo cáo',
    url: '/bao-cao',
    icon: BarChart3,
  },
*/
  {
    title: 'Cài đặt',
    url: '/cai-dat',
    icon: Settings,
  },
]