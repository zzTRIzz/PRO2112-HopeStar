import Navbar from '@/features/ui-client/components/navbar'
import OrderTrackingPage from '@/features/ui-client/pages/taikhoan/trang-con/OrderTrackingPage'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/(auth)/taikhoan/don-hang-cua-toi/thong-tin/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
      <Navbar />
      <OrderTrackingPage />
      </>
}
