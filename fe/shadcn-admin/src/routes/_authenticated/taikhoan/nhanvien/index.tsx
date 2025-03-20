import MyForm from '@/features/taikhoan - nhanvien/MyForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/taikhoan/nhanvien/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <MyForm />
  </>
}
