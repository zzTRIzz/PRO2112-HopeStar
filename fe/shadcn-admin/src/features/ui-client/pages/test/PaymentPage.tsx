import { useEffect, useRef, useState } from 'react'
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
  const processedRef = useRef(false) // Add ref to track if payment was processed

  useEffect(() => {
    const processPaymentResult = async () => {
      // Skip if already processed
      if (processedRef.current) return

      try {
        if (!vnp_ResponseCode || !vnp_TransactionStatus) {
          throw new Error('Missing payment response parameters')
        }

        const orderJson = localStorage.getItem('order')
        if (!orderJson) {
          throw new Error('No order data found')
        }

        const { orderData } = JSON.parse(orderJson)

        if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
          processedRef.current = true // Mark as processed before API call
          await order(orderData)

          toast({
            title: 'Thanh toán thành công',
            description: 'Đơn hàng của bạn đã được tạo thành công',
          })
          localStorage.removeItem('order')
          await queryClient.invalidateQueries({ queryKey: ['cart'] })
          navigate({ to: '/gio-hang' })
        } else {
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

    processPaymentResult()
  }, [vnp_ResponseCode, vnp_TransactionStatus, navigate])

  return (
    <div>
      {isProcessing && 
        <>
          <div className='flex h-full items-center justify-center'>
            <IconLoader2 className='h-8 w-8 animate-spin' />
          </div>
        </>
      }
    </div>
  )
}
