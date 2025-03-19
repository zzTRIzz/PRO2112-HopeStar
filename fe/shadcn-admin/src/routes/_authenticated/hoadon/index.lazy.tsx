import QuanLyHoaDon from '@/features/hoadon/QuanLyHoaDon'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/hoadon/')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <>
    <QuanLyHoaDon/>
    </>
  )
}
