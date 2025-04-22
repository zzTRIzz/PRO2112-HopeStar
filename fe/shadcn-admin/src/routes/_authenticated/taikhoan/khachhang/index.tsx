import MyForm from '@/features/taikhoan/MyForm'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated/taikhoan/khachhang/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Quản lý khách hàng | HopeStar'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return (
    <>
      <MyForm />
    </>
  )
}
