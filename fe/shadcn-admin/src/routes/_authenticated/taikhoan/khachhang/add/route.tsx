import { createFileRoute } from '@tanstack/react-router'
import AddCustomer from '@/features/taikhoan/khachhang/pages/add'

export const Route = createFileRoute('/_authenticated/taikhoan/khachhang/add')({
  component: AddCustomer,
})
