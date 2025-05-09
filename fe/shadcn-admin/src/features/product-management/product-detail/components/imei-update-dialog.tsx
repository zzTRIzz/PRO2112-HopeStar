import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { DialogDescription } from '@radix-ui/react-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
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
import { updateImei } from '@/features/product-management/attribute/imei/data/api-service'
import { StatusImei } from '@/features/product-management/attribute/imei/data/schema'
import { Route } from '@/routes/_authenticated/route'

const formSchema = z.object({
  imeiCode: z
    .string()
    .min(15, 'IMEI phải có 15 kí tự')
    .max(15, 'IMEI phải có 15 kí tự'),
  status: z.nativeEnum(StatusImei, {
    required_error: 'Vui lòng chọn trạng thái',
  }),
})

interface ImeiUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: { id: number }
}

export const ImeiUpdateDialog: React.FC<ImeiUpdateDialogProps> = ({
  open,
  onOpenChange,
  currentRow,
}) => {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
const { id } = Route.useParams()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imeiCode: currentRow.code || '',
      status: currentRow.statusImei as StatusImei || StatusImei.IN_ACTIVE,
    },
  })

  const { mutate: submitImei } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      updateImei(currentRow.id, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['product-details',id],
      })

      toast({
        title: 'Thành công',
        description: 'Cập nhật IMEI thành công',
        className: 'bg-white',
      })

      onOpenChange(false)
      form.reset()
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật IMEI',
        variant: 'destructive',
      })
      setIsSubmitting(false)
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    submitImei(values)
  }

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      SOLD: 'Đã bán',
      IN_ACTIVE: 'Không hoạt động',
      NOT_SOLD: 'Chưa bán'
    }
    return statusLabels[status] || status
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset()
        }
        onOpenChange(open)
      }}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Cập nhật IMEI</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin IMEI cho sản phẩm
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='imeiCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IMEI</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập mã IMEI...' {...field} />
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn trạng thái' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(StatusImei).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {/* đổi giá trị hiển thị  */}
                          {getStatusLabel(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='bg-blue-500 hover:bg-blue-600'
              >
                {isSubmitting ? 'Đang xử lý...' : 'Cập nhật'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ImeiUpdateDialog
