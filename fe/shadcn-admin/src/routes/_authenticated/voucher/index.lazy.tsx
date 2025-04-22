import { createLazyFileRoute } from '@tanstack/react-router'
import VoucherUI from '../../../features/voucher/VoucherUI'
import { useEffect } from 'react'
export const Route = createLazyFileRoute('/_authenticated/voucher/')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.title = 'Quản lý voucher | HopeStar'
    return () => {
      document.title = 'HopeStar'
    }
  }, [])
  return (
    <>
      <VoucherUI />
    </>
  )
}
