import { createFileRoute } from '@tanstack/react-router'
import EditCustomer from '@/features/taikhoan/khachhang/pages/edit'

export const Route = createFileRoute('/_authenticated/taikhoan/khachhang/edit/$id')({
  component: EditCustomer,
})
