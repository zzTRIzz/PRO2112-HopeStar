import {
  IconDeviceMobile,
  IconFileDollar,
  IconMessages,
  IconPointFilled,
  IconShoppingCart,
  IconUser,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarDataNhanVien: Omit<SidebarData, 'user'> = {
  teams: [
    {
      name: 'HopeStar',
      logo: Command,
      plan: 'pro2112-nganct4',
    },
  ],
  navGroups: [
    {
      title: 'Tổng quan',
      items: [
        {
          title: 'Sản phẩm',
          url: '/product',
          icon: IconDeviceMobile,
        },
        {
          title: 'Bán hàng tại quầy',
          url: '/banhang',
          icon: IconShoppingCart,
        },
        {
          title: 'Quản lý hóa đơn',
          url: '/hoadon',
          icon: IconFileDollar,
        },
        {
          title: 'Quản lý tài khoản',
          icon: IconUser,
          items: [
            {
              title: 'Khách hàng',
              url: '/taikhoan/khachhang',
            },
          ],
        },
        {
          title: 'Quản lý liên hệ',
          url: '/quan-ly-lien-he',
          icon: IconMessages,
        },
      ],
    },
  ],
}
