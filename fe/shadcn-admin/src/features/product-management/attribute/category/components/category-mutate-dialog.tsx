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
import { Category, categorySchema } from '../data/schema'
import { useCategoryMutation } from '../hooks/use-category-mutation'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Category
}

export function CategoryMutateDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const queryClient = useQueryClient()
  const isUpdate = !!currentRow
  const { mutate, isPending } = useCategoryMutation(isUpdate)

  const form = useForm<Category>({
    resolver: zodResolver(categorySchema.omit({ id: true })),
    defaultValues: currentRow || {
      name: '',
      status: 'ACTIVE',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        name: currentRow.name,
        status: currentRow.status || 'ACTIVE',
      })
    }
  }, [currentRow, form.reset])

  const onSubmit = (data: Omit<Category, 'id'>) => {
    const submitData = isUpdate ? { ...data, id: currentRow?.id } : data

    mutate(submitData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['categories'] })
        onOpenChange(false)
        form.reset()
        toast({
          title: 'Thành công',
          description: `Danh mục đã được ${isUpdate ? 'cập nhật' : 'tạo mới'} thành công`,
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
            {isUpdate ? 'Cập nhật danh mục' : 'Tạo mới danh mục'}
          </DialogTitle>
          <DialogDescription>
            {isUpdate
              ? 'Cập nhật thông tin danh mục bằng cách điền các thông tin cần thiết.'
              : 'Thêm danh mục mới bằng cách điền các thông tin cần thiết.'}
            Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='category-form'
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation() // Ngăn sự kiện bubbling
              form.handleSubmit(onSubmit)(e)
            }}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Nhập tên danh mục' />
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
          <Button form='category-form' type='submit' disabled={isPending}>
            {isPending ? 'Đang lưu...' : `${isUpdate ? 'Cập nhật' : 'Lưu'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
