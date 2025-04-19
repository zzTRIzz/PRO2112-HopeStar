import { createLazyFileRoute } from '@tanstack/react-router'
import Dashboard from '@/features/dashboard'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Thống kê | HopeStar'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return <Dashboard />
}
