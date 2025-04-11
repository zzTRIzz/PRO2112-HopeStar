import { createLazyFileRoute } from '@tanstack/react-router'
import { PaymentResultPage } from '@/features/ui-client/pages/test/PaymentPage'
import Navbar from '@/features/ui-client/components/navbar'

export const Route = createLazyFileRoute('/(auth)/dat-hang/payment-result')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      vnp_ResponseCode: String(search.vnp_ResponseCode || ''),
      vnp_TransactionStatus: String(search.vnp_TransactionStatus || ''),
    }
  },
})
function RouteComponent() {
  return (
    <>
      <Navbar />
      <PaymentResultPage />
    </>
  )
}