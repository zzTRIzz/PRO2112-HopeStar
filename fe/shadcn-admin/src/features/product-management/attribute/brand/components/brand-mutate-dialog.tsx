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
import { SelectDropdown } from '@/components/select-dropdown'
import { Brand, brandSchema } from '../data/schema'
import { useBrandMutation } from '../hooks/use-brand-mutation'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Brand
}

export function BrandMutateDialog({ open, onOpenChange, currentRow }: Props) {
  const queryClient = useQueryClient()
  const isUpdate = !!currentRow
  const { mutate, isPending } = useBrandMutation(isUpdate)

  const form = useForm<Brand>({
    resolver: zodResolver(brandSchema.omit({ id: true })),
    defaultValues: currentRow || {
      name: '',
      status: '',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        name: currentRow.name,
        status: currentRow.status,
      })
    }
  }, [currentRow, form.reset])

  const onSubmit = (data: Omit<Brand, 'id'>) => {
    const submitData = isUpdate ? { ...data, id: currentRow?.id } : data

    mutate(submitData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['brands'] })
        onOpenChange(false)
        form.reset()
        toast({
          title: 'Thành công',
          description: `Thương hiệu đã được ${isUpdate ? 'cập nhật' : 'tạo mới'} thành công`,
          className: 'fixed top-4 right-4 md:max-w-[300px] bg-white',
          duration: 2000,
        })
      },
      onError: (error: any) => {
        toast({
          title: 'Lỗi',
          description:
            error.message ||
            `Không thể ${isUpdate ? 'cập nhật' : 'tạo mới'} thương hiệu`,
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
            {isUpdate ? 'Cập nhật thương hiệu' : 'Tạo mới thương hiệu'}
          </DialogTitle>
          <DialogDescription>
            {isUpdate
              ? 'Cập nhật thông tin thương hiệu bằng cách điền các thông tin cần thiết.'
              : 'Thêm thương hiệu mới bằng cách điền các thông tin cần thiết.'}
            Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='brand-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thương hiệu</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Nhập tên thương hiệu' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Chọn trạng thái'
                    items={[
                      { label: 'Hoạt động', value: 'ACTIVE' },
                      { label: 'Ngừng hoạt động', value: 'IN_ACTIVE' },
                    ]}
                  />
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
          <Button form='brand-form' type='submit' disabled={isPending}>
            {isPending ? 'Đang lưu...' : `${isUpdate ? 'Cập nhật' : 'Lưu'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
