import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IconLoader2 } from '@tabler/icons-react'
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
import { ImageUploader } from '../../product/create-product/components/upload-image'
import { updateProductDetail } from '../data/api-service'
import {
  ProductDetailResponse,
  ProductDetailUpdate,
  productDetailUpdateSchema,
} from '../data/schema'
import { Route } from '@/routes/_authenticated/route'
import { toast } from '@/hooks/use-toast'
interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: ProductDetailResponse
}

export function ProductDetailUpdateDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const queryClient = useQueryClient()
  const { id } = Route.useParams()
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProductDetailUpdate) =>
      updateProductDetail(currentRow.id, data),
    onSuccess: async () => {
      // Invalidate cả product-details query để load lại dữ liệu
      await queryClient.invalidateQueries({
        queryKey: ['product-details',id],
      })

      onOpenChange(false)
      toast({
        title: 'Thành công',
        description: 'Cập nhật thành công',
        className: 'bg-white',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message|| 'Không thể cập nhật',
        variant: 'destructive',
      })
    },
  })

  const form = useForm<ProductDetailUpdate>({
    resolver: zodResolver(productDetailUpdateSchema),
    defaultValues: {
      priceSell: 0,
      imageUrl: '',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        priceSell: currentRow.priceSell,
        imageUrl: currentRow.imageUrl,
      })
    }
  }, [currentRow, form.reset])

  const onSubmit = (data: ProductDetailUpdate) => {
    mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Cập nhật sản phẩm chi tiết</DialogTitle>
          <DialogDescription>
            RAM: {currentRow?.ramCapacity}GB / ROM: {currentRow?.romCapacity}GB
            / Màu: {currentRow?.colorName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='product-detail-form'
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit(onSubmit)(e)
            }}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='priceSell'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá bán</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hình ảnh</FormLabel>
                  <FormControl>
                    <ImageUploader
                      currentImage={field.value}
                      onImageChange={field.onChange}
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
          <Button form='product-detail-form' type='submit' disabled={isPending}>
            {isPending ? (
              <>
                <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang cập nhật...
              </>
            ) : (
              'Cập nhật'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProductDetailUpdateDialog
