import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { getProfile } from '@/features/ui-client/data/api-service'
import { Profile } from '@/features/ui-client/data/schema'
import { Link } from '@tanstack/react-router'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

export function ProfileDropdown() {
  const [profile, setProfile] = useState<Profile | null>(null)
  useEffect(() => {
    loadProfile()
  }, [])
  const loadProfile = async () => {
    const data = await getProfile()
          if (data) {
            setProfile(data)
          }
  }
  // const signupData = JSON.parse(localStorage.getItem('profile') || '{}')
  // const { name, email, idRole } = signupData
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt='@shadcn' />
            <AvatarFallback>{profile?.idRole === 2 ? 'AD' : 'NV'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{profile?.name}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {profile?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/taikhoan/thong-tin-ca-nhan'>
              Tài khoản
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem asChild>
            <Link to='/settings'>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            Cookies.remove('jwt')
            localStorage.removeItem('profile')
            window.location.href = '/sign-in'
          }}
        >
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
