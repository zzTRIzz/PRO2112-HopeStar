import { createLazyFileRoute } from '@tanstack/react-router'
import SaleUI from '../../../features/sale/SaleUI'

export const Route = createLazyFileRoute('/_authenticated/sale/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <SaleUI />
    </>
  )
}
