import { createLazyFileRoute } from '@tanstack/react-router'
import VoucherUI from '../../../features/voucher/VoucherUI'
export const Route = createLazyFileRoute('/_authenticated/voucher/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <VoucherUI />
    </>
  )
}
