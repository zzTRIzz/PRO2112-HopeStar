import { createFileRoute } from '@tanstack/react-router'
import { AccountLayout } from '../../../../features/ui-client/pages/taikhoan/AccountLayout'
import { AccountPage } from '../../../../features/ui-client/pages/taikhoan/trang-con/AccountPage'
import Navbar from '@/features/ui-client/components/navbar'

export const Route = createFileRoute('/(auth)/taikhoan/thong-tin-ca-nhan/')({
  component: () => (
    <>
    <Navbar />
    <AccountLayout>
      <AccountPage />
    </AccountLayout>
    </>
  )
})
