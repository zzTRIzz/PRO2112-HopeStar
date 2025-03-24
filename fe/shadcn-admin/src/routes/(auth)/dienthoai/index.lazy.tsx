import HomePageDienThoai from '@/features/ui-client/pages/home-page-dien-thoai'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(auth)/dienthoai/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <HomePageDienThoai />
</>
}
