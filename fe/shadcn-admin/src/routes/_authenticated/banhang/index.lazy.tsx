import BanHangTaiQuay from '@/features/banhang/BanHangTaiQuay'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/banhang/')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <>
    <BanHangTaiQuay />
    </>
  )
}
