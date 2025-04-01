import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconDeviceMobile,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconShoppingCart,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
  IconSubtask,
  IconDiscount,
  IconPointFilled,
  IconUser,
  IconPercentage,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'HopeStar',
      logo: Command,
      plan: 'pro2112-nganct4',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Bán Hàng',
          url: '/banhang',
          icon: IconShoppingCart,
        },
        {
          title: 'Quản lý sản phẩm',
          icon: IconDeviceMobile,
          items: [
            {
              title: 'Sản phẩm',
              url: '/product',
              icon: IconPointFilled,
            },
            {
              title: 'Imei',
              url: '/product/imei',
              icon: IconPointFilled,
            },
            {
              title: 'Ram',
              url: '/product/ram',
              icon: IconPointFilled,
            },
            {
              title: 'Rom',
              url: '/product/rom',
              icon: IconPointFilled,
            },
            {
              title: 'Pin',
              url: '/product/battery',
              icon: IconPointFilled,
            },
            {
              title: 'Sim',
              url: '/product/sim',
              icon: IconPointFilled,
            },
            {
              title: 'Chip',
              url: '/product/chip',
              icon: IconPointFilled,
            },
            {
              title: 'Wifi',
              url: '/product/wifi',
              icon: IconPointFilled,
            },
            {
              title: 'Bluetooth',
              url: '/product/bluetooth',
              icon: IconPointFilled,
            },
            {
              title: 'Màu sắc',
              url: '/product/color',
              icon: IconPointFilled,
            },
            {
              title: 'Thẻ nhớ',
              url: '/product/card',
              icon: IconPointFilled,
            },
            {
              title: 'Phân giải',
              url: '/product/resolution',
              icon: IconPointFilled,
            },
            {
              title: 'Màn hình',
              url: '/product/screen',
              icon: IconPointFilled,
            },
            {
              title: 'Danh mục',
              url: '/product/category',
              icon: IconPointFilled,
            },
            {
              title: 'Thương hiệu',
              url: '/product/brand',
              icon: IconPointFilled,
            },
            {
              title: 'Camera trước',
              url: '/product/front-camera',
              icon: IconPointFilled,
            },
            {
              title: 'Camera sau',
              url: '/product/rear-camera',
              icon: IconPointFilled,
            },
            {
              title: 'Hệ điều hành',
              url: '/product/os',
              icon: IconPointFilled,
            },
          ],
        },
        {
          title: 'Quản lý tài khoản',
          icon: IconUser,
          items: [
            {
              title: 'Khách hàng',
              url: '/taikhoan/khachhang',
            },
            {
              title: 'Nhân viên',
              url: '/taikhoan/nhanvien',
            },
          ],
        },

        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: IconMessages,
        },

        {
          title: 'Voucher',
          url: '/voucher',
          icon: IconDiscount,
        },
        {
          title: 'Sale',
          url: '/sale',
          icon: IconPercentage
        }
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: IconLockAccess,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: IconBug,
          items: [
            {
              title: 'Unauthorized',
              url: '/401',
              icon: IconLock,
            },
            {
              title: 'Forbidden',
              url: '/403',
              icon: IconUserOff,
            },
            {
              title: 'Not Found',
              url: '/404',
              icon: IconError404,
            },
            {
              title: 'Internal Server Error',
              url: '/500',
              icon: IconServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/503',
              icon: IconBarrierBlock,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
