import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
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
import { login } from '../data/api-service'
import { loginRequestSchema } from '../data/schema'
import {jwtDecode} from 'jwt-decode';
import JwtPayload from '../../type'
type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof loginRequestSchema>>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof loginRequestSchema>) {
    setIsLoading(true)
    try {
      const response = await login(data)

      // Xử lý khi thành công
      if (response.status === 0 && response.data?.jwt) {
        Cookies.set('jwt', response.data.jwt, { expires: 7 })
        // Giải mã JWT để lấy role
      const decoded = jwtDecode<JwtPayload>(response.data.jwt);
      const userRole = decoded.role;
        toast({
          title: 'Đăng nhập thành công',
          description: response.data.message || 'Chào mừng bạn quay trở lại',
        })

        switch(userRole) {
          case '2': // Admin
            navigate({ to: '/dashboard' });
            break;
          case '3': // Staff
            navigate({ to: '/banhang' });
            break;
          case '4': // User thông thường
            navigate({ to: '/' });
            break;
        }
      // navigate({ to: '/' });
      } else {
        // Xử lý khi API trả về status khác 0
        throw new Error(response.data?.message || 'Đăng nhập thất bại')
      }
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error)

      // Xử lý lỗi từ API
      let errorMessage = 'Đã có lỗi xảy ra'

      if (error.response?.data?.error === 'Bad Request') {
        errorMessage =
          error.response.data.message || 'Email hoặc mật khẩu không chính xác'
      } else if (error.message) {
        errorMessage = error.message
      }

      form.setError('root', {
        type: 'manual',
        message: errorMessage,
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
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='email@example.com'
                      {...field}
                      disabled={isLoading}
                    />
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
                  <div className='flex items-center justify-between'>
                    <FormLabel>Mật khẩu</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      placeholder='Nhập mật khẩu'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className='text-sm font-medium text-destructive'>
                {form.formState.errors.root.message}
              </p>
            )}

            <Button className='mt-2' disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
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
