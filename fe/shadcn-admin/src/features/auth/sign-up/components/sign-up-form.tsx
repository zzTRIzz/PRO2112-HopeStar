import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { IconBrandFacebook, IconBrandGoogle } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { sentOtp } from '../../otp/data/api-service'
import { signupRequestSchema } from '../data/schema'

type SignUpFormProps = HTMLAttributes<HTMLDivElement>

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate() // Sử dụng useNavigate để chuyển hướng

  const form = useForm<z.infer<typeof signupRequestSchema>>({
    resolver: zodResolver(signupRequestSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      otp: '',
    },
  })

  async function onSubmit(data: z.infer<typeof signupRequestSchema>) {
    setIsLoading(true)
    try {
      // Gọi API gửi OTP
      const otpResponse = await sentOtp({ email: data.email })
      console.log('OTP đã được gửi:', otpResponse)

      if (otpResponse.status === 0) {
        toast({
          title: 'Thông báo',
          description: otpResponse.data.message || 'Xác thực OTP đã được gửi',
        })

        // Lưu trữ dữ liệu đăng ký tạm thời (có thể sử dụng state hoặc context)
        localStorage.setItem('signupData', JSON.stringify(data))

        // Chuyển hướng sang form OTP
        navigate({ to: '/otp' })
      }
    } catch (error: any) {
      toast({
        title: 'Thông báo lỗi',
        variant: 'destructive',
        description: error.response.data.message || 'Đăng ký thất bại',
      })
      console.error('Lỗi khi gửi OTP:', error)
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
              name='fullName'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder='Nguyễn Văn A' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Tạo tài khoản'}
            </Button>

            {/* <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  hoặc tiếp tục với
                </span>
              </div>
            </div> */}

            {/* <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                disabled={isLoading}
              >
                <IconBrandGoogle className='h-4 w-4' /> Google
              </Button>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                disabled={isLoading}
              >
                <IconBrandFacebook className='h-4 w-4' /> Facebook
              </Button>
            </div> */}
          </div>
        </form>
      </Form>
    </div>
  )
}
