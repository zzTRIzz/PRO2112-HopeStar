import MyForm from '@/features/taikhoan - nhanvien/MyForm'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated/taikhoan/nhanvien/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Quản lý nhân viên | HopeStar'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return <>
    <MyForm />
  </>
}
