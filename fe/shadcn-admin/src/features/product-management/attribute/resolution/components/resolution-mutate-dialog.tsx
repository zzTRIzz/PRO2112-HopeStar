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
import { Resolution, resolutionSchema } from '../data/schema'
import { useResolutionMutation } from '../hooks/use-resolution-mutation'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Resolution
}

export function ResolutionMutateDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const queryClient = useQueryClient()
  const isUpdate = !!currentRow
  const { mutate, isPending } = useResolutionMutation(isUpdate)

  const form = useForm<Resolution>({
    resolver: zodResolver(resolutionSchema.omit({ id: true })),
    defaultValues: currentRow || {
      width: 0,
      height: 0,
      resolutionType: '',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        width: currentRow.width,
        height: currentRow.height,
        resolutionType: currentRow.resolutionType,
      })
    } else {
      form.reset({
        width: 0,
        height: 0,
        resolutionType: '',
      })
    }
  }, [currentRow, form.reset])

  const onSubmit = async (data: Omit<Resolution, 'id'>) => {
    const submitData = isUpdate ? { ...data, id: currentRow?.id } : data

    mutate(submitData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['resolutions'],
          exact: true,
        })
        await queryClient.refetchQueries({
          queryKey: ['resolutions'],
          exact: true,
        })
        onOpenChange(false)
        form.reset({
          width: 0,
          height: 0,
          resolutionType: '',
        })
        toast({
          title: 'Thành công',
          description: `${isUpdate ? 'Đã cập nhật' : 'Đã tạo'} thành công`,
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
            {isUpdate ? 'Cập nhật' : 'Tạo'} Độ phân giải
          </DialogTitle>
          <DialogDescription>
            {isUpdate
              ? 'Cập nhật độ phân giải bằng cách cung cấp thông tin cần thiết.'
              : 'Thêm một độ phân giải mới bằng cách cung cấp thông tin cần thiết.'}
            Nhấn lưu khi bạn hoàn tất.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='resolution-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='resolutionType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại độ phân giải</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ví dụ: HD, Full HD, 4K...' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='height'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chiều cao (px)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder='Nhập chiều cao'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='width'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chiều rộng (px)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder='Nhập chiều rộng'
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
          <Button form='resolution-form' type='submit' disabled={isPending}>
            {isPending ? 'Đang lưu...' : `${isUpdate ? 'Cập nhật' : 'Lưu'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
