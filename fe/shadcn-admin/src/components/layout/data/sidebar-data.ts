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
    }
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        }
        ,
        {
          title: 'Product Management',
          icon: IconDeviceMobile,
          items: [
            {
              title: 'Product',
              url: '/product',
            },
            {
              title: 'Imei',
              url: '/product/imei',
            },
            {
              title: 'Ram',
              url: '/product/ram',
            },
            {
              title: 'Rom',
              url: '/product/rom',
            },
            {
              title: 'Color',
              url: '/product/color',
            },
            {
              title: 'Battery',
              url: '/product/battery',
            },
            {
              title: 'Bluetooth',
              url: '/product/bluetooth',
            },
            {
              title: 'Brand',
              url: '/product/brand',
            },
            {
              title: 'Card',
              url: '/product/card',
            },
            {
              title: 'Category',
              url: '/product/category',
            },
            {
              title: 'Chip',
              url: '/product/chip',
            },
            {
              title: 'Screen',
              url: '/product/screen',
            },
            {
              title: 'Sim',
              url: '/product/sim',
            },
            {
              title: 'Wifi',
              url: '/product/wifi',
            },
          ]
        }
        ,
        {
          title: 'Tasks',
          url: '/tasks',
          icon: IconSubtask,
        },

        {
          title: 'Counter',
          url: '/apps',
          icon: IconShoppingCart,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: IconMessages,
        },
        {
          title: 'Users',
          url: '/users',
          icon: IconUsers,
        },
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
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
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
