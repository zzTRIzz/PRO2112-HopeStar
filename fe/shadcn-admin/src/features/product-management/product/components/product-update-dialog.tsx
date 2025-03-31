import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { IconLoader2 } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateProduct } from '../data/api-service'
import { ProductResponse, ProductUpdate, productUpdate } from '../data/schema'
import { useFetchData } from './data-table-toolbar'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: ProductResponse
}

export function ProductResponsesUpdateDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const queryClient = useQueryClient()
  const isUpdate = !!currentRow
  const attributes = useFetchData()

  const { mutate: updateProductMutation, isPending } = useMutation({
    mutationFn: (data: ProductUpdate) => updateProduct(currentRow!.id!, data),
    onSuccess: () => {
      toast({
        title: 'Thành công',
        description: 'Cập nhật sản phẩm thành công',
      })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast({
        title: 'Thất bại',
        description:
          error.response?.data?.message ||
          'Có lỗi xảy ra khi cập nhật sản phẩm',
        variant: 'destructive',
      })
    },
  })

  const form = useForm<ProductUpdate>({
    resolver: zodResolver(productUpdate),
    defaultValues: {
      name: '',
      description: '',
      weight: 0,
      idChip: 0,
      idBrand: 0,
      idScreen: 0,
      idCard: 0,
      idOs: 0,
      idWifi: 0,
      idBluetooth: 0,
      nfc: false,
      idBattery: 0,
      chargerType: '',
      content: '',
    },
  })

  // Reset form khi currentRow hoặc attributes thay đổi
  useEffect(() => {
    if (currentRow && attributes) {
      form.reset({
        name: currentRow.name,
        description: currentRow.description,
        weight: currentRow.weight,
        idChip:
          attributes.chips?.find((c) => c.name === currentRow.nameChip)?.id ||
          0,
        idBrand:
          attributes.brands?.find((b) => b.name === currentRow.nameBrand)?.id ||
          0,
        idScreen:
          attributes.screens?.find((s) => s.type === currentRow.typeScreen)
            ?.id || 0,
        idCard:
          attributes.cards?.find((c) => c.type === currentRow.typeCard)?.id ||
          0,
        idOs: attributes.os?.find((o) => o.name === currentRow.nameOs)?.id || 0,
        idWifi:
          attributes.wifis?.find((w) => w.name === currentRow.nameWifi)?.id ||
          0,
        idBluetooth:
          attributes.bluetooths?.find(
            (b) => b.name === currentRow.nameBluetooth
          )?.id || 0,
        idBattery:
          attributes.batteries?.find((b) => b.type === currentRow.typeBattery)
            ?.id || 0,
        chargerType: currentRow.chargerType,
        nfc: currentRow.nfc,
        content: currentRow.content,
      })
    }
  }, [currentRow, attributes, form.reset])

  const onSubmit = (data: ProductUpdate) => {
    if (!isUpdate || !currentRow?.id) return

    const formData = {
      name: data.name,
      description: data.description,
      weight: data.weight,
      idChip: data.idChip,
      idBrand: data.idBrand,
      idScreen: data.idScreen,
      idCard: data.idCard,
      idOs: data.idOs,
      idWifi: data.idWifi,
      idBluetooth: data.idBluetooth,
      nfc: data.nfc,
      idBattery: data.idBattery,
      chargerType: data.chargerType,
      content: data.content,
    }

    updateProductMutation(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Cập nhật sản phẩm</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin chi tiết sản phẩm.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='h-[400px] pr-4'>
          <Form {...form}>
            <form
              id='product-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              {/* Basic fields */}
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên sản phẩm</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='weight'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Khối lượng (g)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description field */}
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Select inputs */}
              <div className='grid grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='idChip'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chip</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn chip' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {attributes?.chips?.map((chip) => (
                            <SelectItem
                              key={chip.id}
                              value={chip.id.toString()}
                            >
                              {chip.name}
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
                  name='idBrand'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hãng sản xuất</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn hãng' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {attributes?.brands?.map((brand) => (
                            <SelectItem
                              key={brand.id}
                              value={brand.id.toString()}
                            >
                              {brand.name}
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
                  name='idScreen'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Màn hình</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn màn hình' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {attributes?.screens?.map((screen) => (
                            <SelectItem
                              key={screen.id}
                              value={screen.id.toString()}
                            >
                              {screen.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='idCard'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card đồ họa</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn card' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {attributes?.cards?.map((card) => (
                            <SelectItem
                              key={card.id}
                              value={card.id.toString()}
                            >
                              {card.type}
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
                  name='idOs'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hệ điều hành</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn hệ điều hành' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {attributes?.os?.map((os) => (
                            <SelectItem key={os.id} value={os.id.toString()}>
                              {os.name}
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
                  name='idWifi'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wifi</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn Wifi' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {attributes?.wifis?.map((wifi) => (
                            <SelectItem
                              key={wifi.id}
                              value={wifi.id.toString()}
                            >
                              {wifi.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='idBluetooth'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bluetooth</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn Bluetooth' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {attributes?.bluetooths?.map((bluetooth) => (
                            <SelectItem
                              key={bluetooth.id}
                              value={bluetooth.id.toString()}
                            >
                              {bluetooth.name}
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
                  name='idBattery'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pin</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn pin' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {attributes?.batteries?.map((battery) => (
                            <SelectItem
                              key={battery.id}
                              value={battery.id.toString()}
                            >
                              {battery.type}
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
                  name='chargerType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại sạc</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* sim */}
              {/* <div className='grid grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name='sim'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SIM</FormLabel>
                      <FormControl>
                        <div className='flex min-h-10 flex-wrap gap-1 rounded-md border p-2'>
                          {field.value?.length ? (
                            attributes.sims
                              ?.filter((sim) => field.value.includes(sim.id))
                              .map((sim) => (
                                <span key={sim.id} className='text-sm'>
                                  {sim.type}
                                </span>
                              ))
                          ) : (
                            <span className='text-sm text-muted-foreground'>
                              Không có thông tin
                            </span>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='frontCamera'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Camera trước</FormLabel>
                      <FormControl>
                        <div className='flex min-h-10 flex-wrap gap-1 rounded-md border p-2'>
                          {field.value?.length ? (
                            attributes.frontCameras
                              ?.filter((camera) =>
                                field.value.includes(camera.id)
                              )
                              .map((camera) => (
                                <span key={camera.id} className='text-sm'>
                                  {camera.resolution}
                                </span>
                              ))
                          ) : (
                            <span className='text-sm text-muted-foreground'>
                              Không có thông tin
                            </span>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='rearCamera'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Camera sau</FormLabel>
                      <FormControl>
                        <div className='flex min-h-10 flex-wrap gap-1 rounded-md border p-2'>
                          {field.value?.length ? (
                            attributes.rearCameras
                              ?.filter((camera) =>
                                field.value.includes(camera.id)
                              )
                              .map((camera) => (
                                <span key={camera.id} className='text-sm'>
                                  {camera.resolution}
                                </span>
                              ))
                          ) : (
                            <span className='text-sm text-muted-foreground'>
                              Không có thông tin
                            </span>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}

              <FormField
                control={form.control}
                name='nfc'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>NFC</FormLabel>
                      <FormDescription>
                        Thiết bị có hỗ trợ NFC không?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button form='product-form' type='submit' disabled={isPending}>
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
