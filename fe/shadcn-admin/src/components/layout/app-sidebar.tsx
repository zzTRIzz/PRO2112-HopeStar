import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import ForbiddenError from '@/features/errors/forbidden'
import { sidebarData } from './data/sidebar-data'
import { sidebarDataNhanVien } from './data/sidebar-data-nhan-vien'
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie'
import { useProfile } from './data/useProfile'


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  // const signupData = JSON.parse(localStorage.getItem('profile') || '{}')
  // const { idRole } = signupData

  // Giải mã JWT để lấy role
  interface JwtPayload {
    iat: number;
    exp: number;
    email: string;
    role: string;
  }
  const token = Cookies.get('jwt')
  const decoded = token ? jwtDecode<JwtPayload>(token) : null;
  const idRole = decoded?.role;

  const {profile} = useProfile();

  interface User {
    name: string | undefined
    email: string | undefined
    avatar: string | undefined
    role: number | undefined
  }
  
  const user:User = {name: profile?.name, email: profile?.email, avatar: profile?.avatar, role: profile?.idRole}
  
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {idRole === "2" ? (
          sidebarData.navGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))
        ) : idRole === "3" ? (
          sidebarDataNhanVien.navGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))
        ) : (
          <ForbiddenError />
        )}
      </SidebarContent>
      <SidebarFooter>
          <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
