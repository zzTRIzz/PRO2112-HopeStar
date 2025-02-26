import MyForm from '@/features/taikhoan/MyForm'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/taikhoan/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    <MyForm />
    </>
  )
}
