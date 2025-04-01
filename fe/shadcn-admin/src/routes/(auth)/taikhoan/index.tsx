import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Navbar from '@/features/ui-client/components/navbar'
import { AccountLayout } from '../../../features/ui-client/pages/taikhoan/AccountLayout'

export const Route = createFileRoute('/(auth)/taikhoan/')({
  component: Layout,
})

function Layout() {
  return (
    <>
      <Navbar />
      <AccountLayout>
        <p>Chọn một mục từ menu bên trái</p>
      </AccountLayout>
    </>
  )
}
