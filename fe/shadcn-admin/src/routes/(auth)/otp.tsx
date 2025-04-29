import { createFileRoute } from '@tanstack/react-router'
import Otp from '@/features/auth/otp'
import { useEffect } from 'react'

export const Route = createFileRoute('/(auth)/otp')({
  component: RouteComponent,
})
function RouteComponent() {
  useEffect(() => {
    document.title = "Xác thực OTP tài khoản | HopeStar"
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return <Otp />
}