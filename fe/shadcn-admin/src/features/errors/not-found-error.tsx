import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function NotFoundError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>404</h1>
        <span className='font-medium'>Không tìm thấy trang!</span>
        <p className='text-center text-muted-foreground'>
          Có vẻ như đây là trang bạn đang tìm kiếm <br />
          không tồn tại hoặc có thể đã bị xóa.
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
