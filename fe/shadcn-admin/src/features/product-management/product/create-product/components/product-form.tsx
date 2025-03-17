import { Control } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
  rearCameras?: { id: number; resolution: string }[]
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
  return (
    <div className='mx-auto space-y-4 rounded border px-4 py-6'>
      <h1 className='text-center text-2xl font-semibold'>Create Product</h1>

      {/* Basic Information */}
      <div className='w-full'>
        <FormField
          control={control}
          name='productRequest.name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product name</FormLabel>
              <FormControl>
                <Input placeholder='' {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder='' className='min-h-8' {...field} />
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
                <FormLabel>Categories</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className='w-full justify-between'
                        disabled={!categories}
                      >
                        {field.value.length > 0 && categories
                          ? categories
                              .filter((category) =>
                                field.value.includes(category.id.toString())
                              )
                              .map((category) => category.name)
                              .join(', ')
                          : 'Select categories'}
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
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* weight */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.weight'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight(g)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder=''
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
                <FormLabel>Brand</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select brand' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brands?.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
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
                      <SelectValue placeholder='Select chip' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {chips?.map((chip) => (
                      <SelectItem key={chip.id} value={chip.id.toString()}>
                        {chip.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* battery */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.idBattery'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Battery</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select battery' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {batteries?.map((battery) => (
                      <SelectItem
                        key={battery.id}
                        value={battery.id.toString()}
                      >
                        {battery.type} - {battery.capacity}mAh
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* man hinh */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.idScreen'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Screen</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select screen' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {screens?.map((screen) => (
                      <SelectItem key={screen.id} value={screen.id.toString()}>
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
                      <SelectValue placeholder='Select bluetooth' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bluetooths?.map((bluetooth) => (
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
        </div>
        {/* card */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.idCard'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select card' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cards?.map((card) => (
                      <SelectItem key={card.id} value={card.id.toString()}>
                        {card.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* os */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.idOs'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Os</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select os' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {os?.map((os) => (
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
                      <SelectValue placeholder='Select wifi' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {wifis?.map((wifi) => (
                      <SelectItem key={wifi.id} value={wifi.id.toString()}>
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
        {/* charger */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.chargerType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Charger</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)} // Không cần chuyển đổi thành số
                  defaultValue={field.value || ''} // Đảm bảo giá trị mặc định là chuỗi
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select charger' />
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
                  <FormLabel>NFC Support</FormLabel>
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
                <FormLabel>Sim</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className='w-full justify-between'
                        disabled={!sims}
                      >
                        {field.value.length > 0 && sims
                          ? sims
                              .filter((sim) =>
                                field.value.includes(sim.id.toString())
                              )
                              .map((sim) => sim.type)
                              .join(', ')
                          : 'Select sims'}
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
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Front Camera */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.frontCamera'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Front Camera</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className='w-full justify-between'
                        disabled={!frontCameras}
                      >
                        {field.value.length > 0 && frontCameras
                          ? frontCameras
                              .filter((camera) =>
                                field.value.includes(camera.id.toString())
                              )
                              .map((camera) => camera.resolution)
                              .join(', ')
                          : 'Select front cameras'}
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
                          <span>{camera.resolution}</span>
                        </div>
                      ))}
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Rear Camera */}
        <div className=''>
          <FormField
            control={control}
            name='productRequest.rearCamera'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rear Camera</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className='w-full justify-between'
                        disabled={!rearCameras}
                      >
                        {field.value.length > 0 && rearCameras
                          ? rearCameras
                              .filter((camera) =>
                                field.value.includes(camera.id.toString())
                              )
                              .map((camera) => camera.resolution)
                              .join(', ')
                          : 'Select rear cameras'}
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
                          <span>{camera.resolution}</span>
                        </div>
                      ))}
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
