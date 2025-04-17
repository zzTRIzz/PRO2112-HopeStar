import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function ForbiddenError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>403</h1>
        <span className='font-medium'>Truy cập bị cấm</span>
        <p className='text-center text-muted-foreground'>
          Bạn không có sự cho phép <br />
          để xem tài nguyên này.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            Quay lại trang trước
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>Quay lại trang chủ</Button>
        </div>
      </div>
    </div>
  )
}
