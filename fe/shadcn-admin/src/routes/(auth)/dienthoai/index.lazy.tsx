import { createLazyFileRoute } from '@tanstack/react-router'
import HomePageDienThoai from '@/features/ui-client/pages/home-page-dien-thoai'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/(auth)/dienthoai/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Điện thoại | HopeStar'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return <>
    <HomePageDienThoai />
</>
}
