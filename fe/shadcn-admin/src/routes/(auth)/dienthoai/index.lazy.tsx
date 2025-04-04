import { createLazyFileRoute } from '@tanstack/react-router'
import HomePageDienThoai from '@/features/ui-client/pages/home-page-dien-thoai'

export const Route = createLazyFileRoute('/(auth)/dienthoai/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <HomePageDienThoai />
</>
}
