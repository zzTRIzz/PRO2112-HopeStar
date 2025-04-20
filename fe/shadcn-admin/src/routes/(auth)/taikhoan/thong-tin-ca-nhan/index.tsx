import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Navbar from '@/features/ui-client/components/navbar'
import { AccountLayout } from '../../../../features/ui-client/pages/taikhoan/AccountLayout'
import { AccountPage } from '../../../../features/ui-client/pages/taikhoan/trang-con/AccountPage'

export const Route = createFileRoute('/(auth)/taikhoan/thong-tin-ca-nhan/')({
  component: AccountInfo,
})

export default function AccountInfo() {
  return (
    useEffect(() => {
      document.title = 'Thông tin tài khoản | HopeStar'
      return () => {
        document.title = 'HopeStar'
      }
    }, []),
    (
      <>
        <Navbar />
        <AccountLayout>
          <AccountPage />
        </AccountLayout>
      </>
    )
  )
}
