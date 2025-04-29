import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient, useQuery } from '@tanstack/react-query'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getResolution } from '../../resolution/data/api-service'
import { Screen, screenSchema } from '../data/schema'
import { useScreenMutation } from '../hooks/use-screen-mutation'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Screen
}

export function ScreenMutateDialog({ open, onOpenChange, currentRow }: Props) {
  const queryClient = useQueryClient()
  const isUpdate = !!currentRow
  const { mutate, isPending } = useScreenMutation(isUpdate)

  // Truy vấn để lấy danh sách độ phân giải
  const { data: resolutions } = useQuery({
    queryKey: ['resolutions'],
    queryFn: getResolution,
  })

  const form = useForm<Screen>({
    resolver: zodResolver(screenSchema.omit({ id: true })),
    defaultValues: currentRow || {
      type: '',
      displaySize: 0,
      resolution: {
        width: 0,
        height: 0,
        resolutionType: '',
      },
      status: 'ACTIVE',
      refreshRate: 0,
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        type: currentRow.type,
        displaySize: currentRow.displaySize,
        resolution: currentRow.resolution,
        status: currentRow.status || 'ACTIVE',
        refreshRate: currentRow.refreshRate,
      })
    }
  }, [currentRow, form.reset])

  const onSubmit = (data: Omit<Screen, 'id'>) => {
    const submitData = isUpdate ? { ...data, id: currentRow?.id } : data

    mutate(submitData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['screens'] })
        onOpenChange(false)
        form.reset()
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
          <DialogTitle>{isUpdate ? 'Cập nhật' : 'Tạo'} Màn hình</DialogTitle>
          <DialogDescription>
            {isUpdate
              ? 'Cập nhật màn hình bằng cách cung cấp thông tin cần thiết.'
              : 'Thêm một màn hình mới bằng cách cung cấp thông tin cần thiết.'}
            Nhấn lưu khi bạn hoàn tất.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='screen-form'
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
                    <Input {...field} placeholder='Nhập loại màn hình' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='displaySize'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kích thước màn hình (inch)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.1'
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder='Nhập kích thước màn hình'
                    />
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
                  <FormLabel>Độ phân giải</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const resolution = JSON.parse(value)
                      field.onChange(resolution)
                    }}
                    value={
                      field.value ? JSON.stringify(field.value) : undefined
                    }
                    defaultValue={
                      field.value ? JSON.stringify(field.value) : undefined
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn độ phân giải'>
                        {field.value &&
                          `${field.value.width}x${field.value.height} (${field.value.resolutionType})`}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {resolutions?.map((resolution) => (
                        <SelectItem
                          key={resolution.id}
                          value={JSON.stringify(resolution)}
                        >
                          {`${resolution.width}x${resolution.height} (${resolution.resolutionType})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='refreshRate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tần số quét (Hz)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder='Nhập tần số quét'
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
          <Button form='screen-form' type='submit' disabled={isPending}>
            {isPending ? 'Đang lưu...' : `${isUpdate ? 'Cập nhật' : 'Lưu'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
