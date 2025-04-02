import ChiTietHoaDon from '@/features/hoadon/Chitiethoadon/ChiTietHoaDon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/hoadon/hoadonchitiet')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    <ChiTietHoaDon/>
    </>
  )
  
}
