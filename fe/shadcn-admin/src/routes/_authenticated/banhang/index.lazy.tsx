import BanHangTaiQuay from '@/features/banhang/BanHangTaiQuay'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/_authenticated/banhang/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
        document.title = 'Bán hàng tại quầy | HopeStar'
        return () => {
          document.title = 'HopeStar'
        }
      }, [])
  return(
    <>
    <BanHangTaiQuay />
    </>
  )
}
