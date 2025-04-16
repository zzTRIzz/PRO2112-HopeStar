import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { ResetPasswordForm } from './components/reset-password-form'

export default function ResetPassword() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='mb-2 flex flex-col space-y-2 text-left'>
          <h1 className='text-md font-semibold tracking-tight'>
            Quên mật khẩu
          </h1>
          <p className='text-sm text-muted-foreground'>
            Đăng ký lại mật khẩu với tài khoản của bạn trong 15 phút tới.
          </p>
        </div>
        <ResetPasswordForm />
      </Card>
    </AuthLayout>
  )
}
