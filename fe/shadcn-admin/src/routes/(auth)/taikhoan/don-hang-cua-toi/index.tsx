import { createFileRoute } from '@tanstack/react-router'
import { AccountLayout } from '../../../../features/ui-client/pages/taikhoan/AccountLayout'
import { OrdersPage } from '../../../../features/ui-client/pages/taikhoan/trang-con/OrderPage'
import Navbar from '@/features/ui-client/components/navbar'

export const Route = createFileRoute('/(auth)/taikhoan/don-hang-cua-toi/')({
  component: () => (
    <>
    <Navbar />
    <AccountLayout>
      <OrdersPage />
    </AccountLayout>
    </>
  )
})
