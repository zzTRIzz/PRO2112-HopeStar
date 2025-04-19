import Navbar from '@/features/ui-client/components/navbar'
import OrderTrackingPage from '@/features/ui-client/pages/taikhoan/trang-con/OrderTrackingPage'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createLazyFileRoute(
  '/(auth)/taikhoan/don-hang-cua-toi/thong-tin/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Thông tin đơn hàng | HopeStar'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return <>
      <Navbar />
      <OrderTrackingPage />
      </>
}
