import { Link } from '@tanstack/react-router'
import { Icon } from '@iconify/react'

interface BreadcrumbProps {
  items: {
    label: string
    href?: string
  }[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className='mx-auto flex items-center gap-2 px-4 py-4 text-sm text-gray-600'>
      <Link to='/' className='flex items-center gap-1 hover:text-blue-500'>
        <Icon icon='lucide:home' className='h-4 w-4' />
        Trang chủ
      </Link>
      {items.map((item, index) => (
        <div key={index} className='flex items-center space-x-1'>
          <Icon icon='lucide:chevron-right' className='h-4 w-4 text-gray-400' />
          {item.href ? (
            <Link to={item.href} className='hover:text-blue-500'>
              {item.label}
            </Link>
          ) : (
            <span className='font-semibold text-gray-800'>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
