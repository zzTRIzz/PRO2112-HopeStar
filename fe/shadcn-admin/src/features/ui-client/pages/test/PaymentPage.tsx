import { Card } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Route as PaymentRoute } from '@/routes/(auth)/dat-hang/payment-result.lazy'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export function PaymentResultPage() {
  const { vnp_ResponseCode, vnp_TransactionStatus } = PaymentRoute.useSearch()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        if (!vnp_ResponseCode || !vnp_TransactionStatus) {
          throw new Error('Missing payment response parameters')
        }

        // Get stored order data
        const orderData = localStorage.getItem('order')
        

        if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
          // Payment successful - create order
          // await order(orderData)

          toast({
            title: 'Thanh toán thành công',
            description: 'Đơn hàng của bạn đã được tạo thành công',
          })
          // Clear pending order
          localStorage.removeItem('order')

          // Redirect to order success page
          // navigate({ to: '/gio-hang' })
        } else {
          // Payment failed
          throw new Error('Thanh toán không thành công')
        }
      } catch (error) {
        console.error('Payment processing error:', error)
        toast({
          title: 'Lỗi xử lý thanh toán',
          description: error.message || 'Vui lòng thử lại',
          variant: 'destructive',
        })
      } finally {
        setIsProcessing(false)
      }
    }

    processPaymentResult()
  }, [vnp_ResponseCode, vnp_TransactionStatus, navigate])

  return (
    <div className='min-h-screen bg-[#F7F7F7] p-4 md:p-6'>
      <div className='mx-auto max-w-2xl'>
        <Card className='p-6'>
          <div className='text-center'>
            {isProcessing ? (
              <>
                <h1 className='mb-4 text-xl font-bold'>
                  Đang xử lý kết quả thanh toán
                </h1>
                <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary-500' />
              </>
            ) : (
              <h1 className='text-xl font-bold'>
                Đang triển khai tính năng này. Vui lòng quay lại sau.
              </h1>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
