import { createFileRoute } from '@tanstack/react-router'
import KhachHangList from '@/features/taikhoan/khachhang'

export const Route = createFileRoute('/_authenticated/taikhoan/khachhang')({
  component: KhachHangList,
})
