import Cookies from 'js-cookie'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'
import ForbiddenError from '@/features/errors/forbidden'
import { jwtDecode } from 'jwt-decode'

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
})

function RouteComponent() {
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'

  interface JwtPayload {
    iat: number;
    exp: number;
    email: string;
    role: string;
  }
  const token = Cookies.get('jwt')
  const decoded = token ? jwtDecode<JwtPayload>(token) : null;
  const idRole = decoded?.role || 0;

  return (
    <>
      {idRole === "2" || idRole === "3" ? (
        <SearchProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <SkipToMain />
            <AppSidebar />
            <div
              id='content'
              className={cn(
                'ml-auto w-full max-w-full',
                'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
                'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
                'transition-[width] duration-200 ease-linear',
                'flex h-svh flex-col',
                'group-data-[scroll-locked=1]/body:h-full',
                'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
              )}
            >
              <Outlet />
            </div>
          </SidebarProvider>
        </SearchProvider>
      ) : (
        <ForbiddenError />
      )}
    </>
  )
}
