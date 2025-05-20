import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@heroui/react'
import { Menu, Search, ShoppingCart, X } from 'lucide-react'
import { getBrandActive } from '@/features/product-management/product/data/api-service'
import { cn } from '../../../lib/utils'
import { getProfile } from '../data/api-service'
import { Profile } from '../data/schema'
import { useCart } from '../hooks/use-cart'
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

// Custom event name - must match the one defined in AccountPage.tsx
const PROFILE_UPDATED_EVENT = 'profile-updated';

interface Brand {
  id: number
  name: string
  imageUrl: string
}
export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const { cart } = useCart()
  const [isLoading, setIsLoading] = useState(true)
  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrandActive,
  })
  
  useEffect(() => {
    loadProfile()
    
    // Add event listener for profile updates
    const handleProfileUpdated = () => {
      loadProfile()
    }
    
    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated)
    
    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated)
    }
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

  // const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') {
  //     // Chỉ navigate khi có giá trị search
  //     if (searchValue.trim()) {
  //       navigate({
  //         to: '/dienthoai',
  //         search: {
  //           key: searchValue.trim(),
  //         },
  //       })
  //       // Reset search state
  //       setSearchValue('')
  //       setIsSearchOpen(false)
  //     }
  //   }
  // }

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
      <Dropdown placement='bottom-end'>
        <DropdownTrigger>
          <User
            as='button'
            avatarProps={{
              isBordered: true,
              src: profile.avatar || 'https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144857620.jpg',
              className: 'w-7 h-7 sm:w-8 sm:h-8',
            }}
            className='transition-transform'
            description={
              <span className='hidden sm:inline'>{profile.email}</span>
            }
            name={<span className='text-sm sm:text-base'>{profile.name}</span>}
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label='User Actions'
          variant='flat'
          className='w-56 sm:w-64'
        >
          <DropdownItem key='profile'>
            <Link href='/taikhoan/thong-tin-ca-nhan'>Thông tin cá nhân</Link>
          </DropdownItem>
          <DropdownItem key='orders'>
            <Link href='/taikhoan/don-hang-cua-toi'>Đơn hàng của tôi</Link>
          </DropdownItem>

          {profile?.idRole === 2 ? (
            <DropdownItem key='admin'>
              <Link to='/dashboard'>Quản trị viên</Link>
            </DropdownItem>
          ) : profile?.idRole === 3 ? (
            <DropdownItem key='staff'>
              <Link to='/banhang'>Nhân viên</Link>
            </DropdownItem>
          ) : null}
          <DropdownItem
            key='logout'
            color='danger'
            onClick={() => {
              Cookies.remove('jwt')
              localStorage.removeItem('profile')
              navigate({
                to: '/sign-in',
              })
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
      <div className='container flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6'>
        {/* Logo and Mobile Menu */}
        <div className='flex items-center gap-2 sm:gap-4 md:gap-10'>
          <Link to='/' className='flex items-center space-x-2'>
            <img
              src='/images/favicon.svg'
              alt='HopeStar Logo'
              className='h-5 w-5 sm:h-6 sm:w-6'
            />
            <span className='hidden text-xl font-bold sm:inline sm:text-2xl'>
              HopeStar
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='sm' className='md:hidden'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-[280px] p-0 sm:w-[350px]'>
              <nav className='flex h-full flex-col'>
                <div className='border-b p-4'>
                  <Link to='/' className='flex items-center space-x-2'>
                    <img
                      src='/images/favicon.svg'
                      alt='HopeStar Logo'
                      className='h-5 w-5'
                    />
                    <span className='text-lg font-bold'>HopeStar</span>
                  </Link>
                </div>
                <div className='flex-1 overflow-auto py-4'>
                  <NavigationMenuMobile brands={brands} />
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Navigation */}
          <NavigationMenu className='hidden md:flex'>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  Các hãng điện thoại
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
                    {brands?.map((brand: Brand) => (
                      <li key={brand.id}>
                        <NavigationMenuLink asChild>
                          <Link
                            to='/dienthoai'
                            search={{
                              brand: brand.id,
                            }}
                            className={cn(
                              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                            )}
                          >
                            <div className='text-sm font-medium leading-none'>
                              {brand.name}
                            </div>
                            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                              Cùng khám phá những các hãng {brand.name}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to='/chinh-sach-cua-cua-hang'
                    className='group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
                  >
                    Chính sách của cửa hàng
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to='/tra_cuu_don_hang'
                    className='group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
                  >
                    Tra cứu đơn hàng
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to='/lien-he'
                    className='group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
                  >
                    Liên hệ
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-2 sm:gap-4'>
          <Button variant='ghost' size='icon' asChild className='relative'>
            <Link to='/gio-hang'>
              <ShoppingCart className='h-[18px] w-[18px] sm:h-5 sm:w-5' />
              <Badge className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center text-xs sm:h-5 sm:w-5'>
                {cart?.quantityCartDetail || 0}
              </Badge>
            </Link>
          </Button>
          {renderUserMenu()}
        </div>
      </div>
    </header>
  )
}
const NavigationMenuMobile = ({ brands }: { brands: Brand[] | undefined }) => {
  return (
    <div className='space-y-4 px-4'>
      <div className='space-y-1'>
        <h4 className='mb-3 text-sm font-medium leading-none'>
          Các hãng điện thoại
        </h4>
        <div className='grid grid-cols-2 gap-2'>
          {brands?.map((brand) => (
            <Link
              key={brand.id}
              to='/dienthoai'
              search={{ brand: brand.id }}
              className='flex items-center space-x-2 rounded-md p-2 text-sm hover:bg-accent'
            >
              <span>{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className='space-y-3 border-t pt-4'>
        <Link
          to='/chinh-sach-cua-cua-hang'
          className='block px-2 py-1.5 text-sm hover:text-primary'
        >
          Chính sách của cửa hàng
        </Link>
        <Link
          to='/tra_cuu_don_hang'
          className='block px-2 py-1.5 text-sm hover:text-primary'
        >
          Tra cứu đơn hàng
        </Link>
        <Link
          to='/lien-he'
          className='block px-2 py-1.5 text-sm hover:text-primary'
        >
          Liên hệ
        </Link>
      </div>
    </div>
  )
}