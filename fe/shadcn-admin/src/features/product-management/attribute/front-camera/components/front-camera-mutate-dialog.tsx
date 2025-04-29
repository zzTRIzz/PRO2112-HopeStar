import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FrontCamera, frontCameraSchema } from '../data/schema'
import { useFrontCameraMutation } from '../hooks/use-front-camera-mutation'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: FrontCamera
}

export function FrontCameraMutateDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const queryClient = useQueryClient()
  const isUpdate = !!currentRow
  const { mutate, isPending } = useFrontCameraMutation(isUpdate)

  const form = useForm<FrontCamera>({
    resolver: zodResolver(frontCameraSchema.omit({ id: true })),
    defaultValues: currentRow || {
      type: '',
      resolution: 0,
      status: 'ACTIVE',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        type: currentRow.type,
        resolution: currentRow.resolution,
        status: currentRow.status || 'ACTIVE',
      })
    }
  }, [currentRow, form.reset])

  const onSubmit = (data: Omit<FrontCamera, 'id'>) => {
    const submitData = isUpdate ? { ...data, id: currentRow?.id } : data

    mutate(submitData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['frontCameras'] })
        onOpenChange(false)
        form.reset()
        toast({
          title: 'Thành công',
          description: `${isUpdate ? 'Cập nhật' : 'Tạo mới'} thành công`,
          className: 'fixed top-4 right-4 md:max-w-[300px] bg-white',
          duration: 2000,
        })
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          `Không thể ${isUpdate ? 'cập nhật' : 'tạo mới'}`

        toast({
          title: 'Lỗi',
          description: errorMessage,
          variant: 'destructive',
          className: 'fixed top-4 right-4 md:max-w-[300px]',
          duration: 2000,
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Cập nhật' : 'Tạo mới'} Camera trước
          </DialogTitle>
          <DialogDescription>
            {isUpdate
              ? 'Cập nhật thông tin camera trước bằng cách điền các thông tin cần thiết.'
              : 'Thêm camera trước mới bằng cách điền các thông tin cần thiết.'}
            Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='frontCamera-form'
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation() // Ngăn sự kiện bubbling
              form.handleSubmit(onSubmit)(e)
            }}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Nhập loại camera' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='resolution'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Độ phân giải (MP)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder='Nhập độ phân giải'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button form='frontCamera-form' type='submit' disabled={isPending}>
            {isPending ? 'Đang lưu...' : `${isUpdate ? 'Cập nhật' : 'Lưu'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
