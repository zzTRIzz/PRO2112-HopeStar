import ChiTietHoaDon from '@/features/hoadon/Chitiethoadon/ChiTietHoaDon'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated/hoadon/hoadonchitiet')({
  
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
      document.title = 'Quản lý chi tiết hóa đơn | HopeStar'
      return () => {
        document.title = 'HopeStar'
      }
    }, [])
  return (
    <>
    <ChiTietHoaDon/>
    </>
  )
  
}
