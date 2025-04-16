import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { IconLoader2 } from '@tabler/icons-react'
import { Route as PaymentRoute } from '@/routes/(auth)/dat-hang/payment-result.lazy'
import { toast } from '@/hooks/use-toast'
import { Card } from '@/components/ui/card'
import { order } from '../../data/api-cart-service'

export function PaymentResultPage() {
  const { vnp_ResponseCode, vnp_TransactionStatus } = PaymentRoute.useSearch()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(true)
  const queryClient = useQueryClient()
  const processPaymentResult = async () => {
    try {
      if (!vnp_ResponseCode || !vnp_TransactionStatus) {
        throw new Error('Missing payment response parameters')
      }

      // Fix the data retrieval to match CheckoutPage format
      const orderJson = localStorage.getItem('order')
      if (!orderJson) {
        throw new Error('No order data found')
      }

      const { orderData } = JSON.parse(orderJson)

      if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
        // Payment successful
        await order(orderData)
        toast({
          title: 'Thanh toán thành công',
          description: 'Đơn hàng của bạn đã được tạo thành công',
        })
        // Clear pending order
        localStorage.removeItem('order')
        await queryClient.invalidateQueries({ queryKey: ['cart'] })
        navigate({ to: '/gio-hang' })
      } else {
        // Payment failed
        throw new Error('Thanh toán không thành công')
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      toast({
        title: 'Lỗi xử lý thanh toán',
        description: error?.response?.data?.message || 'Vui lòng thử lại',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }
  useEffect(() => {
      processPaymentResult()
  }, [vnp_ResponseCode, vnp_TransactionStatus, navigate])

  return (
    <div>
      {isProcessing ? (
        <>
          <div className='flex h-full items-center justify-center'>
            <IconLoader2 className='h-8 w-8 animate-spin' />
          </div>
        </>
      ) : (
        <div className='min-h-screen bg-[#F7F7F7] p-4 md:p-6'>
          <div className='mx-auto max-w-2xl'>
            <Card className='p-6'>
              <div className='text-center'>
                <h1 className='text-xl font-bold'>
                  Thanh toán không thành công
                  <br /> Vui lòng thử lại
                </h1>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
