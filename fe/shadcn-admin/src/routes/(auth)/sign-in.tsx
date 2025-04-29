import { createFileRoute } from '@tanstack/react-router'
import SignIn from '@/features/auth/sign-in'
import { useEffect } from 'react'

export const Route = createFileRoute('/(auth)/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Đăng nhập'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return (
    <>
      <SignIn />
    </>
  )
}
