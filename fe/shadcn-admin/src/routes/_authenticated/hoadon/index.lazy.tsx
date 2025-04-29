import QuanLyHoaDon from '@/features/hoadon/QuanLyHoaDon'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/_authenticated/hoadon/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Quản lý hóa đơn | HopeStar'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return(
    <>
    <QuanLyHoaDon/>
    </>
  )
}
