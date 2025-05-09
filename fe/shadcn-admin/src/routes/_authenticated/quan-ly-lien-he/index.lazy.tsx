import { createLazyFileRoute } from '@tanstack/react-router'
import ContactManagement from '@/features/lien-he'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/_authenticated/quan-ly-lien-he/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Quản lý hóa đơn | HopeStar'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return(
    <>
    <ContactManagement />
    </>
  )
}
