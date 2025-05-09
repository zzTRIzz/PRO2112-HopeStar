import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'

export default function SignUp() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='mb-2 flex flex-col space-y-2 text-left'>
          <h1 className='text-lg font-semibold tracking-tight'>
            Tạo tài khoản
          </h1>
          <p className='text-sm text-muted-foreground'>
            Nhập email và mật khẩu của bạn để tạo tài khoản. <br />
            Đã có tài khoản?{' '}
            <Link
              to='/sign-in'
              className='underline underline-offset-4 hover:text-primary'
            >
              Đăng nhập
            </Link>
          </p>
        </div>
        <SignUpForm />
        {/* <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          Bằng việc tạo tài khoản, bạn đồng ý với{' '}
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
          </a>
          của chúng tôi.
        </p> */}
      </Card>
    </AuthLayout>
  )
}
