import { useState } from 'react'
import { Control } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import AddIcon from '@mui/icons-material/Add'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { BatteryMutateDialog } from '@/features/product-management/attribute/battery/components/battery-mutate-dialog'
import { BluetoothMutateDialog } from '@/features/product-management/attribute/bluetooth/components/bluetooth-mutate-dialog'
import { BrandMutateDialog } from '@/features/product-management/attribute/brand/components/brand-mutate-dialog'
import { CardMutateDialog } from '@/features/product-management/attribute/card/components/card-mutate-dialog'
import { CategoryMutateDialog } from '@/features/product-management/attribute/category/components/category-mutate-dialog'
import { ChipMutateDialog } from '@/features/product-management/attribute/chip/components/chip-mutate-dialog'
import { FrontCameraMutateDialog } from '@/features/product-management/attribute/front-camera/components/front-camera-mutate-dialog'
import { OsMutateDialog } from '@/features/product-management/attribute/os/components/os-mutate-dialog'
import { RearCameraMutateDialog } from '@/features/product-management/attribute/rear-camera/components/rear-camera-mutate-dialog'
import { ScreenMutateDialog } from '@/features/product-management/attribute/screen/components/screen-mutate-dialog'
import { SimMutateDialog } from '@/features/product-management/attribute/sim/components/sim-mutate-dialog'
import { WifiMutateDialog } from '@/features/product-management/attribute/wifi/components/wifi-mutate-dialog'
import { CHARGER_TYPES, ProductConfigRequest } from '../../data/schema'

interface ProductFormProps {
  control: Control<ProductConfigRequest>
  batteries?: { id: number; type: string; capacity: number }[]
  bluetooths?: { id: number; name: string }[]
  brands?: { id: number; name: string }[]
  cards?: { id: number; type: string }[]
  categories?: { id: number; name: string }[]
  chips?: { id: number; name: string }[]
  frontCameras?: { id: number; resolution: string }[]
  os?: { id: number; name: string }[]
  rearCameras?: { id: number; type: string; resolution: string }[]
  screens?: { id: number; type: string }[]
  sims?: { id: number; type: string }[]
  wifis?: { id: number; name: string }[]
}

export function ProductForm({
  control,
  batteries,
  bluetooths,
  brands,
  cards,
  categories,
  chips,
  frontCameras,
  os,
  rearCameras,
  screens,
  sims,
  wifis,
}: ProductFormProps) {
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isSimDialogOpen, setIsSimDialogOpen] = useState(false)
  const [isScreenDialogOpen, setIsScreenDialogOpen] = useState(false)
  const [isBatteryDialogOpen, setIsBatteryDialogOpen] = useState(false)
  const [isChipDialogOpen, setIsChipDialogOpen] = useState(false)
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false)
  const [isBluetoothDialogOpen, setIsBluetoothDialogOpen] = useState(false)
  const [isWifiDialogOpen, setIsWifiDialogOpen] = useState(false)
  const [isOsDialogOpen, setIsOsDialogOpen] = useState(false)
  const [isCameraFDialogOpen, setIsCameraFDialogOpen] = useState(false)
  const [isCameraRDialogOpen, setIsCameraRDialogOpen] = useState(false)

  const queryClient = useQueryClient()
  const handleBrandDialogClose = async () => {
    // Invalidate and refetch brands data
    await queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
    setIsBrandDialogOpen(false)
  }
  const handleCategoryDialogClose = async () => {
    // Invalidate and refetch categories data
    await queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
    setIsCategoryDialogOpen(false)
  }
  const handleSimDialogClose = async () => {
    // Invalidate and refetch sims data
    await queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
    setIsSimDialogOpen(false)
  }
  const handleScreenDialogClose = async () => {
    // Invalidate and refetch screens data
    await queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
    setIsScreenDialogOpen(false)
  }
  const handleBatteryDialogClose = async () => {
    // Invalidate and refetch batteries data
    await queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
    setIsBatteryDialogOpen(false)
  }
  const handleChipDialogClose = async () => {
    // Invalidate and refetch chips data
    await queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
    setIsChipDialogOpen(false)
  }
  const handleCardDialogClose = async () => {
    // Invalidate and refetch cards data
    await queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
    setIsCardDialogOpen(false)
  }
  const handleBluetoothDialogClose = async () => {
    // Invalidate and refetch bluetooths data
    await queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
    setIsBluetoothDialogOpen(false)
  }
  const handleWifiDialogClose = async () => {
    // Invalidate and refetch wifis data
    await queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
    setIsWifiDialogOpen(false)
  }
  const handleOsDialogClose = async () => {
    // Invalidate and refetch os data
    await queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
    setIsOsDialogOpen(false)
  }
  const handleCameraFDialogClose = async () => {
    // Invalidate and refetch cameras data
    await queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
    setIsCameraFDialogOpen(false)
  }
  const handleCameraRDialogClose = async () => {
    // Invalidate and refetch cameras data
    await queryClient.invalidateQueries({ queryKey: ['productAttributes'] })
    setIsCameraRDialogOpen(false)
  }

  return (
    <div className='mx-auto space-y-4 rounded border px-4 py-6 shadow'>
      <h1 className='text-center text-2xl font-semibold'>Tạo sản phẩm</h1>

      {/* Basic Information */}
      <div className='w-full'>
        <FormField
          control={control}
          name='productRequest.name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sản phẩm</FormLabel>
              <FormControl>
                <Input placeholder=' ' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='w-full'>
        <FormField
          control={control}
          name='productRequest.description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder=' ' className='min-h-8' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        {/* Categories */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.category'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className='w-full justify-between overflow-hidden text-ellipsis whitespace-nowrap'
                        disabled={!categories}
                      >
                        {field.value.length > 0 && categories
                          ? categories
                              .filter((category) =>
                                field.value.includes(category.id.toString())
                              )
                              .map((category) => category.name)
                              .join(', ')
                          : ''}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-[210px] p-0'>
                    <ScrollArea className='h-40'>
                      {categories?.map((category) => (
                        <div
                          key={category.id}
                          className='flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-100'
                          onClick={() => {
                            const newValue = field.value.includes(
                              category.id.toString()
                            )
                              ? field.value.filter(
                                  (val) => val !== category.id.toString()
                                )
                              : [...field.value, category.id.toString()]
                            field.onChange(newValue)
                          }}
                        >
                          <Checkbox
                            checked={field.value.includes(
                              category.id.toString()
                            )}
                            disabled={!categories}
                          />
                          <span>{category.name}</span>
                        </div>
                      ))}
                    </ScrollArea>
                    <div className='relative border-t'>
                      <Button
                        type='button'
                        variant='ghost'
                        className='w-full justify-center text-sm font-normal'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setIsCategoryDialogOpen(true)
                        }}
                      >
                        <AddIcon className='h-6 w-6' />
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <CategoryMutateDialog
            open={isCategoryDialogOpen}
            onOpenChange={handleCategoryDialogClose}
          />
        </div>

        {/* weight */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.weight'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trọng lượng (g)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder=' '
                    {...field}
                    value={field.value || ''} // Đảm bảo giá trị không bị undefined
                    onChange={(e) => field.onChange(Number(e.target.value))} // Chuyển đổi thành số
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* hang */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.idBrand'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thương hiệu</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn thương hiệu' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className='h-40'>
                      {brands?.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                    <div className='relative border-t'>
                      <Button
                        type='button'
                        variant='ghost'
                        className='w-full justify-center text-sm font-normal'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setIsBrandDialogOpen(true)
                        }}
                      >
                        <AddIcon className='h-6 w-6' />
                      </Button>
                    </div>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <BrandMutateDialog
            open={isBrandDialogOpen}
            onOpenChange={handleBrandDialogClose}
          />
        </div>
        {/* chip */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.idChip'
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
                    <ScrollArea className='h-40'>
                      {chips?.map((chip) => (
                        <SelectItem key={chip.id} value={chip.id.toString()}>
                          {chip.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                    <div className='relative border-t'>
                      <Button
                        type='button'
                        variant='ghost'
                        className='w-full justify-center text-sm font-normal'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setIsChipDialogOpen(true)
                        }}
                      >
                        <AddIcon className='h-6 w-6' />
                      </Button>
                    </div>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <ChipMutateDialog
            open={isChipDialogOpen}
            onOpenChange={handleChipDialogClose}
          />
        </div>
        {/* battery */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.idBattery'
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
                    <ScrollArea className='h-40'>
                      {batteries?.map((battery) => (
                        <SelectItem
                          key={battery.id}
                          value={battery.id.toString()}
                        >
                          {battery.type} - {battery.capacity}mAh
                        </SelectItem>
                      ))}
                    </ScrollArea>
                    <div className='relative border-t'>
                      <Button
                        type='button'
                        variant='ghost'
                        className='w-full justify-center text-sm font-normal'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setIsBatteryDialogOpen(true)
                        }}
                      >
                        <AddIcon className='h-6 w-6' />
                      </Button>
                    </div>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <BatteryMutateDialog
            open={isBatteryDialogOpen}
            onOpenChange={handleBatteryDialogClose}
          />
        </div>
        {/* man hinh */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.idScreen'
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
                    <ScrollArea className='h-40'>
                      {screens?.map((screen) => (
                        <SelectItem
                          key={screen.id}
                          value={screen.id.toString()}
                        >
                          {screen.type}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                    <div className='relative border-t'>
                      <Button
                        type='button'
                        variant='ghost'
                        className='w-full justify-center text-sm font-normal'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setIsScreenDialogOpen(true)
                        }}
                      >
                        <AddIcon className='h-6 w-6' />
                      </Button>
                    </div>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <ScreenMutateDialog
            open={isScreenDialogOpen}
            onOpenChange={handleScreenDialogClose}
          />
        </div>
        {/* bluetooth */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.idBluetooth'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bluetooth</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn bluetooth' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className='h-40'>
                      {bluetooths?.map((bluetooth) => (
                        <SelectItem
                          key={bluetooth.id}
                          value={bluetooth.id.toString()}
                        >
                          {bluetooth.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                    <div className='relative border-t'>
                      <Button
                        type='button'
                        variant='ghost'
                        className='w-full justify-center text-sm font-normal'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setIsBluetoothDialogOpen(true)
                        }}
                      >
                        <AddIcon className='h-6 w-6' />
                      </Button>
                    </div>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <BluetoothMutateDialog
            open={isBluetoothDialogOpen}
            onOpenChange={handleBluetoothDialogClose}
          />
        </div>
        {/* card */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.idCard'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thẻ nhớ</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn thẻ nhớ' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className='h-40'>
                      {cards?.map((card) => (
                        <SelectItem key={card.id} value={card.id.toString()}>
                          {card.type}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                    <div className='relative border-t'>
                      <Button
                        type='button'
                        variant='ghost'
                        className='w-full justify-center text-sm font-normal'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setIsCardDialogOpen(true)
                        }}
                      >
                        <AddIcon className='h-6 w-6' />
                      </Button>
                    </div>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <CardMutateDialog
            open={isCardDialogOpen}
            onOpenChange={handleCardDialogClose}
          />
        </div>
        {/* os */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.idOs'
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
                    <ScrollArea className='h-40'>
                      {os?.map((os) => (
                        <SelectItem key={os.id} value={os.id.toString()}>
                          {os.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                    <div className='relative border-t'>
                      <Button
                        type='button'
                        variant='ghost'
                        className='w-full justify-center text-sm font-normal'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setIsOsDialogOpen(true)
                        }}
                      >
                        <AddIcon className='h-6 w-6' />
                      </Button>
                    </div>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <OsMutateDialog
            open={isOsDialogOpen}
            onOpenChange={handleOsDialogClose}
          />
        </div>
        {/* wifi */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.idWifi'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wifi</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn wifi' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className='h-40'>
                      {wifis?.map((wifi) => (
                        <SelectItem key={wifi.id} value={wifi.id.toString()}>
                          {wifi.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                    <div className='relative border-t'>
                      <Button
                        type='button'
                        variant='ghost'
                        className='w-full justify-center text-sm font-normal'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setIsWifiDialogOpen(true)
                        }}
                      >
                        <AddIcon className='h-6 w-6' />
                      </Button>
                    </div>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <WifiMutateDialog
            open={isWifiDialogOpen}
            onOpenChange={handleWifiDialogClose}
          />
        </div>
        {/* charger */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.chargerType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sạc</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)} // Không cần chuyển đổi thành số
                  defaultValue={field.value || ''} // Đảm bảo giá trị mặc định là chuỗi
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CHARGER_TYPES?.map((charger) => (
                      <SelectItem key={charger} value={charger}>
                        {charger}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* nfc */}
        <div className='pt-6'>
          <FormField
            control={control}
            name='productRequest.nfc'
            render={({ field }) => (
              <FormItem className='flex items-center justify-between rounded-lg border p-2'>
                <div className='flex items-center gap-2'>
                  <FormLabel>Hỗ trợ NFC</FormLabel>
                </div>
                <div className='flex items-center'>
                  <FormControl>
                    <Switch
                      slot='3'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {/* sim */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.sim'
            render={({ field }) => (
              <FormItem>
                <FormLabel>SIM</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className='w-full justify-between overflow-hidden text-ellipsis whitespace-nowrap'
                        disabled={!sims}
                      >
                        {field.value.length > 0 && sims
                          ? sims
                              .filter((sim) =>
                                field.value.includes(sim.id.toString())
                              )
                              .map((sim) => sim.type)
                              .join(', ')
                          : 'Chọn loại sim'}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='[w-280]'>
                    <ScrollArea className='h-40'>
                      {sims?.map((sim) => (
                        <div
                          key={sim.id}
                          className='flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-100'
                          onClick={() => {
                            const newValue = field.value.includes(
                              sim.id.toString()
                            )
                              ? field.value.filter(
                                  (val) => val !== sim.id.toString()
                                )
                              : [...field.value, sim.id.toString()]
                            field.onChange(newValue)
                          }}
                        >
                          <Checkbox
                            checked={field.value.includes(sim.id.toString())}
                            disabled={!sims}
                          />
                          <span>{sim.type}</span>
                        </div>
                      ))}
                    </ScrollArea>
                    <div className='relative border-t'>
                      <Button
                        type='button'
                        variant='ghost'
                        className='w-full justify-center text-sm font-normal'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setIsSimDialogOpen(true)
                        }}
                      >
                        <AddIcon className='h-6 w-6' />
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <SimMutateDialog
            open={isSimDialogOpen}
            onOpenChange={handleSimDialogClose}
          />
        </div>

        {/* Front Camera */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.frontCamera'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Camera trước</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className='w-full justify-between overflow-hidden text-ellipsis whitespace-nowrap'
                        disabled={!frontCameras}
                      >
                        {field.value.length > 0 && frontCameras
                          ? frontCameras
                              .filter((camera) =>
                                field.value.includes(camera.id.toString())
                              )
                              .map(
                                (camera) =>
                                  `${camera.type}-${camera.resolution}`
                              )
                              .join(', ')
                          : 'Chọn camera trước'}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='[w-280]'>
                    <ScrollArea className='h-40'>
                      {frontCameras?.map((camera) => (
                        <div
                          key={camera.id}
                          className='flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-100'
                          onClick={() => {
                            const newValue = field.value.includes(
                              camera.id.toString()
                            )
                              ? field.value.filter(
                                  (val) => val !== camera.id.toString()
                                )
                              : [...field.value, camera.id.toString()]
                            field.onChange(newValue)
                          }}
                        >
                          <Checkbox
                            checked={field.value.includes(camera.id.toString())}
                            disabled={!frontCameras}
                          />
                            <span>
                            {camera.type} - {camera.resolution}
                            </span>
                        </div>
                      ))}
                    </ScrollArea>
                    <div className='relative border-t'>
                      <Button
                        type='button'
                        variant='ghost'
                        className='w-full justify-center text-sm font-normal'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setIsCameraFDialogOpen(true)
                        }}
                      >
                        <AddIcon className='h-6 w-6' />
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FrontCameraMutateDialog
            open={isCameraFDialogOpen}
            onOpenChange={handleCameraFDialogClose}
          />
        </div>

        {/* Rear Camera */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.rearCamera'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Camera sau</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className='w-full justify-between overflow-hidden text-ellipsis whitespace-nowrap'
                        disabled={!rearCameras}
                      >
                        {field.value.length > 0 && rearCameras
                          ? rearCameras
                              .filter((camera) =>
                                field.value.includes(camera.id.toString())
                              )
                              .map((camera) => `${camera.type}-${camera.resolution}`)
                              .join(', ')
                          : 'Chọn camera sau'}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='[w-280]'>
                    <ScrollArea className='h-40'>
                      {rearCameras?.map((camera) => (
                        <div
                          key={camera.id}
                          className='flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-100'
                          onClick={() => {
                            const newValue = field.value.includes(
                              camera.id.toString()
                            )
                              ? field.value.filter(
                                  (val) => val !== camera.id.toString()
                                )
                              : [...field.value, camera.id.toString()]
                            field.onChange(newValue)
                          }}
                        >
                          <Checkbox
                            checked={field.value.includes(camera.id.toString())}
                            disabled={!rearCameras}
                          />
                          <span>{camera.type} - {camera.resolution}</span>
                        </div>
                      ))}
                    </ScrollArea>
                    <div className='relative border-t'>
                      <Button
                        type='button'
                        variant='ghost'
                        className='w-full justify-center text-sm font-normal'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setIsCameraRDialogOpen(true)
                        }}
                      >
                        <AddIcon className='h-6 w-6' />
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <RearCameraMutateDialog
            open={isCameraRDialogOpen}
            onOpenChange={handleCameraRDialogClose}
          />
        </div>
      </div>
    </div>
  )
}
