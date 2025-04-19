import { createLazyFileRoute } from '@tanstack/react-router'
import Navbar from '@/features/ui-client/components/navbar'
import { Breadcrumb } from '@/features/ui-client/pages/breadcrumb'
import { CartPage } from '@/features/ui-client/pages/gio-hang/CartPage'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/(auth)/gio-hang/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
        document.title = 'Giỏ hàng | HopeStar'
        return () => {
          document.title = 'HopeStar'
        }
      }, [])
  return (
    <>
      <Navbar />
      <Breadcrumb
        items={[
          {
            label: 'Giỏ hàng',
          },
        ]}
      />
      <CartPage />
    </>
  )
}
