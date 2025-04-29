import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { PinInput, PinInputField } from '@/components/pin-input'
import { signup } from '../../sign-up/data/api-service'

type OtpFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  otp: z.string().min(1, { message: 'Vui lòng nhập mã OTP.' }),
})

export function OtpForm({ className, ...props }: OtpFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [disabledBtn, setDisabledBtn] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Lấy dữ liệu đăng ký từ localStorage
      const signupData = JSON.parse(localStorage.getItem('signupData') || '{}')

      // Gọi API đăng ký với dữ liệu đã lưu và mã OTP
      const response = await signup({ ...signupData, otp: data.otp })
      console.log('Đăng ký thành công:', response)

      // Lưu JWT token vào cookie
      if (response.jwt) {
        Cookies.set('jwt', response.jwt, { expires: 7 }) // Lưu cookie trong 7 ngày
      }

      // Xóa dữ liệu đăng ký khỏi localStorage
      localStorage.removeItem('signupData')

      // Hiển thị thông báo thành công
      toast({
        title: 'Đăng ký thành công!',
        description: 'Bạn đã tạo tài khoản thành công.',
      })

      // Chuyển hướng về trang chủ
      navigate({ to: '/' })
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error)
      toast({
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='otp'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormControl>
                    <PinInput
                      {...field}
                      className='flex h-10 justify-between'
                      onComplete={() => setDisabledBtn(false)}
                      onIncomplete={() => setDisabledBtn(true)}
                    >
                      {Array.from({ length: 7 }, (_, i) => {
                        if (i === 3)
                          return <Separator key={i} orientation='vertical' />
                        return (
                          <PinInputField
                            key={i}
                            component={Input}
                            className={`${form.getFieldState('otp').invalid ? 'border-red-500' : ''}`}
                          />
                        )
                      })}
                    </PinInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={disabledBtn || isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Xác thực'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
