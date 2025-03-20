import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/taikhoan/nhanvien/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/taikhoan/nhanvien/"!</div>
}
