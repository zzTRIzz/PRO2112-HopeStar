import Navbar from '@/features/ui-client/components/navbar'
import { CartPage } from '@/features/ui-client/pages/gio-hang/CartPage'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(auth)/gio-hang/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <Navbar /> 
    <CartPage />
  </>
}
