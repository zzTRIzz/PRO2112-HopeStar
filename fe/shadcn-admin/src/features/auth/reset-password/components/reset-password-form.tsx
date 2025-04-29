import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/password-input'
import { reset } from '../../sign-up/data/api-service'
import { Route } from '@/routes/(auth)/reset-password'

const formSchema = z
  .object({
    password: z
      .string().trim()
      .min(1, 'Vui lòng nhập mật khẩu')
      .min(7, 'Mật khẩu phải có ít nhất 7 ký tự')
      ,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

type ResetPasswordFormProps = HTMLAttributes<HTMLDivElement>

export function ResetPasswordForm({
  className,
  ...props
}: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { token } = Route.useSearch()
  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!token) {
      toast({
        title: 'Lỗi',
        description: 'Token không hợp lệ',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await reset(token, data.password)
      toast({
        title: 'Thành công',
        description: response.message || 'Mật khẩu đã được đặt lại thành công',
      })
      navigate({ to: '/sign-in' })
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description:
          error.response?.data?.message || 'Không thể đặt lại mật khẩu',
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
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Mật khẩu mới</FormLabel>
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
                  <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
