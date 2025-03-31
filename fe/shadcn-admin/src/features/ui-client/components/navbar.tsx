import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Link } from '@tanstack/react-router'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User,
} from '@heroui/react'
import { ShoppingCart, Search, Menu, X } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { getProfile } from '../data/api-service'
import { Profile } from '../data/schema'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const jwt = Cookies.get('jwt')
      if (!jwt) {
        setIsLoading(false)
        return
      }

      const data = await getProfile()
      if (data) {
        setProfile(data)
        localStorage.setItem('profile', JSON.stringify(data))
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderUserMenu = () => {
    if (isLoading) {
      return <div className='h-8 w-8 animate-pulse rounded-full bg-muted' />
    }

    if (!profile) {
      return (
        <Button asChild>
          <Link to='/sign-in'>Đăng nhập</Link>
        </Button>
      )
    }

    return (
      <Dropdown placement='bottom-start'>
        <DropdownTrigger>
          <User
            as='button'
            avatarProps={{
              isBordered: true,
              src: profile.avatar || 'https://i.pravatar.cc/150',
            }}
            className='transition-transform'
            description={profile.email}
            name={profile.name}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label='User Actions' variant='flat'>
          <DropdownItem key='profile'>Thông tin cá nhân</DropdownItem>
          <DropdownItem key='orders'>Đơn hàng của tôi</DropdownItem>

          {profile?.idRole === 2 ? (
            <DropdownItem key='admin' asChild>
              <Link to='/dashboard'>Quản trị viên</Link>
            </DropdownItem>
          ) : profile?.idRole === 3 ? (
            <DropdownItem key='staff' asChild>
              <Link to='/banhang'>Nhân viên</Link>
            </DropdownItem>
          ) : null}
          <DropdownItem
            key='logout'
            color='danger'
            onClick={() => {
              Cookies.remove('jwt')
              localStorage.removeItem('profile')
              window.location.href = '/sign-in'
            }}
          >
            Đăng xuất
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-4 md:gap-10'>
          <Link to='/' className='flex items-center space-x-2'>
            <span className='text-2xl font-bold'>HopeStar</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className='hidden md:flex'>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  Các hãng điện thoại
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
                    {[
                      'Apple',
                      'Samsung',
                      'Xiaomi',
                      'Google',
                      'OnePlus',
                      'Nothing',
                      'OPPO',
                      'Vivo',
                    ].map((brand) => (
                      <li key={brand}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={`/`}
                            className={cn(
                              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                            )}
                          >
                            <div className='text-sm font-medium leading-none'>
                              {brand}
                            </div>
                            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                              Cùng khám phá những các hãng {brand}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to='/'
                    className='group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
                  >
                    Cửa hàng (Shop)
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem> */}
              {/* <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/promotions"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    Chương trình khuyến mãi (promotions)
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem> */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to='/'
                    className='group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
                  >
                    Chính sách của cửa hàng
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to='/'
                    className='group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
                  >
                    Liên hệ
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Actions */}
        <div className='hidden items-center gap-4 md:flex'>
          {isSearchOpen ? (
            <div className='flex items-center'>
              <Input
                type='search'
                placeholder='Search phones...'
                className='w-[200px] lg:w-[300px]'
                autoFocus
              />
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsSearchOpen(false)}
                className='ml-2'
              >
                <X className='h-5 w-5' />
              </Button>
            </div>
          ) : (
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsSearchOpen(true)}
              aria-label='Search'
            >
              <Search className='h-5 w-5' />
            </Button>
          )}
          <Button variant='ghost' size='icon' asChild>
            <Link to='/gio-hang' className='relative'>
              <ShoppingCart className='h-5 w-5' />
              <Badge className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center'>
                2
              </Badge>
            </Link>
          </Button>
          {renderUserMenu()}
        </div>

        {/* Mobile Menu Trigger */}
        <div className='flex items-center md:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' aria-label='Menu'>
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>
            <SheetContent side='right'>
              <nav className='grid gap-6 text-lg font-medium'>
                <Link to='/' className='hover:text-foreground/80'>
                  Brands
                </Link>
                <Link to='/' className='hover:text-foreground/80'>
                  Shop
                </Link>
                <Link to='/' className='hover:text-foreground/80'>
                  Promotions
                </Link>
                <Link to='/' className='hover:text-foreground/80'>
                  Support
                </Link>
                <Link to='/' className='hover:text-foreground/80'>
                  Cart (2)
                </Link>
                <Link to='/' className='hover:text-foreground/80'>
                  Account
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
