import { createLazyFileRoute } from '@tanstack/react-router'
import SignUp from '@/features/auth/sign-up'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/(auth)/sign-up')({
  component: RouteComponent,
})
function RouteComponent() {
  useEffect(() => {
    document.title = 'Đăng ký tài khoản | HopeStar'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])

  return <SignUp />
}
