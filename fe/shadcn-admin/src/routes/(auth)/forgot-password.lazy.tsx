import { createLazyFileRoute } from '@tanstack/react-router'
import ForgotPassword from '@/features/auth/forgot-password'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/(auth)/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Quên mật khẩu'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return (
    <>
      <ForgotPassword />
    </>
  )
}

