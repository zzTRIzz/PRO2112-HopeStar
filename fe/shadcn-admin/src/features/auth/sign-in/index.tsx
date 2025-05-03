import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='flex flex-col space-y-2 text-left'>
          <h1 className='text-2xl font-semibold tracking-tight'>Đăng nhập</h1>
          <p className='text-sm text-muted-foreground'>
            Nhập email và mật khẩu của bạn để đăng nhập vào tài khoản. Chưa có
            tài khoản?{' '}
            <Link
              to='/sign-up'
              className='underline underline-offset-4 hover:text-primary'
            >
              Đăng ký
            </Link>
          </p>
        </div>
        <UserAuthForm />
        {/* <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          Bằng việc đăng nhập, bạn đồng ý với{' '}
          <a
            href='/terms'
            className='underline underline-offset-4 hover:text-primary'
          >
            Điều khoản dịch vụ
          </a>{' '}
          và{' '}
          <a
            href='/privacy'
            className='underline underline-offset-4 hover:text-primary'
          >
            Chính sách bảo mật
          </a>{' '}
          của chúng tôi.
        </p> */}
      </Card>
    </AuthLayout>
  )
}
