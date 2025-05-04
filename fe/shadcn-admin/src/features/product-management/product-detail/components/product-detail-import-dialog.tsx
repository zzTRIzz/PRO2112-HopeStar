import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Route } from '@/routes/_authenticated/product/$id.product-detail'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
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
import { importExcelProductDetail } from '@/features/product-management/product-detail/data/api-service'
import { useQueryClient } from '@tanstack/react-query'

const formSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: 'Vui lòng chọn tệp để tải lên',
    })
    .refine(
      (files) =>
        [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ].includes(files?.[0]?.type),
      {
        message: 'Vui lòng chọn tệp Excel',
      }
    ),
})

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailImportDialog({ open, onOpenChange }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: undefined },
  })
  const { id } = Route.useParams()
  const fileRef = form.register('file')
  const queryClient = useQueryClient()
  const onSubmit = async () => {
    const file = form.getValues('file')

    if (file && file[0]) {
      try {
        const response = await importExcelProductDetail(Number(id), file[0])
        toast({
          title: 'Tải lên thành công',
          description: response.message || 'Tệp đã được tải lên thành công.',
        })
        await queryClient.invalidateQueries({
          queryKey: ['product-details',id],
        })
      } catch (error: any) {
        toast({
          title: 'Lỗi',
          description:error.message||'Có lỗi xảy ra khi tải tệp.',
          variant: 'destructive',
        })
      }
    } else {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn tệp để tải lên.',
        variant: 'destructive',
      })
    }
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        form.reset()
      }}
    >
      <DialogContent className='gap-2 sm:max-w-sm'>
        <DialogHeader className='text-left'>
          <DialogTitle>Tải tệp sản phẩm các phiên bản</DialogTitle>
          <DialogDescription>
            Tệp các phiên bản của sản phẩm theo ram, rom, màu sắc
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='task-import-form' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='file'
              render={() => (
                <FormItem className='mb-2 space-y-1'>
                  <FormLabel>Tệp</FormLabel>
                  <FormControl>
                    <Input type='file' {...fileRef} className='h-8' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-2 sm:gap-0'>
          <DialogClose asChild>
            <Button variant='outline'>Hủy</Button>
          </DialogClose>
          <Button type='submit' form='task-import-form'>
            Hoàn tất
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
