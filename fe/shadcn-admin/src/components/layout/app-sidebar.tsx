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
import { sidebarData } from './data/sidebar-data'
import { sidebarDataNhanVien } from './data/sidebar-data-nhan-vien'
import ForbiddenError from '@/features/errors/forbidden'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const signupData = JSON.parse(localStorage.getItem('profile') || '{}')
  const { idRole } = signupData

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {idRole === 2 ? (
          sidebarData.navGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))
        ) : idRole === 3 ? (
          sidebarDataNhanVien.navGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))
        ) : (
          <ForbiddenError />
        )}
      </SidebarContent>
      <SidebarFooter>

          <NavUser user={sidebarData.user} />
        
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}