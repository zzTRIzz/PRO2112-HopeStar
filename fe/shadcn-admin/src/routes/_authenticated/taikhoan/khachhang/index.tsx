import MyForm from '@/features/taikhoan/MyForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/taikhoan/khachhang/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <MyForm />
    </>
  )
}
