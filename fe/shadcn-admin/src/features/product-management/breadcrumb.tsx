import { ChevronRightIcon, HomeIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'

interface BreadcrumbProps {
  items: {
    label: string
    href?: string
  }[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className='flex items-center space-x-1 text-sm text-muted-foreground'>
      <Link to='/' className='hover:text-foreground'>
        <HomeIcon className='h-4 w-4' />
      </Link>
      {items.map((item, index) => (
        <div key={index} className='flex items-center space-x-1'>
          <ChevronRightIcon className='h-4 w-4' />
          {item.href ? (
            <Link to={item.href} className='hover:text-foreground'>
              {item.label}
            </Link>
          ) : (
            <span className='text-foreground'>{item.label}</span>
          )}
        </div>
      ))}
    </div>
  )
}
