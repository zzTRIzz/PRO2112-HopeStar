import {
  IconBrowserCheck,
  IconDeviceMobile,
  IconDiscount,
  IconHelp,
  IconLayoutDashboard,
  IconMessages,
  IconNotification,
  IconPalette,
  IconPercentage,
  IconPointFilled,
  IconSettings,
  IconShoppingCart,
  IconTool,
  IconUser,
  IconUserCog,
  IconFileDollar
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../types'



export const sidebarData: Omit<SidebarData, 'user'> = {
  
  // user: {
  //   name: name,
  //   email: email,
  //   avatar: '/avatars/shadcn.jpg',
  //   role:idRole
  // },
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
          title: 'Thống kê',
          url: '/dashboard',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Bán hàng tại quầy',
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
            {
              title: 'Nhân viên',
              url: '/taikhoan/nhanvien',
            },
          ],
        },
        {
          title: 'Quản lý liên hệ',
          url: '/quan-ly-lien-he',
          icon: IconMessages,
        },
        {
          title: 'Quản lý Voucher',
          url: '/voucher',
          icon: IconDiscount,
        },
        {
          title: 'Quản lý Sale',
          url: '/sale',
          icon: IconPercentage,
        },
        {
          title: 'Nhắn tin',
          url: '/chats',
          // badge: '3',
          icon: IconMessages,
        },
      ],
    },
    // {
    //   title: 'Khác',
    //   items: [
    //     {
    //       title: 'Cài đặt',
    //       icon: IconSettings,
    //       items: [
    //         {
    //           title: 'Profile',
    //           url: '/settings',
    //           icon: IconUserCog,
    //         },
    //         {
    //           title: 'Account',
    //           url: '/settings/account',
    //           icon: IconTool,
    //         },
    //         {
    //           title: 'Appearance',
    //           url: '/settings/appearance',
    //           icon: IconPalette,
    //         },
    //         {
    //           title: 'Notifications',
    //           url: '/settings/notifications',
    //           icon: IconNotification,
    //         },
    //         {
    //           title: 'Display',
    //           url: '/settings/display',
    //           icon: IconBrowserCheck,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Trợ giúp',
    //       url: '/help-center',
    //       icon: IconHelp,
    //     },
    //   ],
    // },
  ]
}
