import { useQuery } from '@tanstack/react-query'
import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getBattery } from '../../attribute/battery/data/api-service'
import { getBluetooth } from '../../attribute/bluetooth/data/api-service'
import { getBrand } from '../../attribute/brand/data/api-service'
import { getCard } from '../../attribute/card/data/api-service'
import { getCategory } from '../../attribute/category/data/api-service'
import { getChip } from '../../attribute/chip/data/api-service'
import { getFrontCamera } from '../../attribute/front-camera/data/api-service'
import { getOs } from '../../attribute/os/data/api-service'
import { getRearCamera } from '../../attribute/rear-camera/data/api-service'
import { getScreen } from '../../attribute/screen/data/api-service'
import { getSim } from '../../attribute/sim/data/api-service'
import { getWifi } from '../../attribute/wifi/data/api-service'
import { STATUS } from '../../product/data/schema'

// Định nghĩa kiểu dữ liệu cho các thuộc tính
interface AttributeItem {
  id: number
  name: string
  capacity: number
  type: string
  resolution: string
}

interface AttributeData {
  batteries: AttributeItem[]
  bluetooths: AttributeItem[]
  brands: AttributeItem[]
  cards: AttributeItem[]
  categories: AttributeItem[]
  chips: AttributeItem[]
  os: AttributeItem[]
  screens: AttributeItem[]
  wifis: AttributeItem[]
  frontCameras: AttributeItem[]
  rearCameras: AttributeItem[]
  sims: AttributeItem[]
}

export const useFetchData = () => {
  const { data } = useQuery<AttributeData>({
    queryKey: ['productAttributes'],
    queryFn: async () => {
      const [
        batteries,
        bluetooths,
        brands,
        cards,
        categories,
        chips,
        os,
        screens,
        wifis,
        frontCameras,
        rearCameras,
        sims,
      ] = await Promise.all([
        getBattery(),
        getBluetooth(),
        getBrand(),
        getCard(),
        getCategory(),
        getChip(),
        getOs(),
        getScreen(),
        getWifi(),
        getFrontCamera(),
        getRearCamera(),
        getSim(),
      ])

      return {
        batteries: batteries || [],
        bluetooths: bluetooths || [],
        brands: brands || [],
        cards: cards || [],
        categories: categories || [],
        chips: chips || [],
        os: os || [],
        screens: screens || [],
        wifis: wifis || [],
        frontCameras: frontCameras || [],
        rearCameras: rearCameras || [],
        sims: sims || [],
      }
    },
  })

  return (
    data || {
      batteries: [],
      bluetooths: [],
      brands: [],
      cards: [],
      categories: [],
      chips: [],
      os: [],
      screens: [],
      wifis: [],
      frontCameras: [],
      rearCameras: [],
      sims: [],
    }
  )
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchValue: string
  setSearchValue: (value: string) => void
  idChip: number | undefined
  setIdChip: (value: number | undefined) => void
  idBrand: number | undefined
  setIdBrand: (value: number | undefined) => void
  idScreen: number | undefined
  setIdScreen: (value: number | undefined) => void
  idCard: number | undefined
  setIdCard: (value: number | undefined) => void
  idOs: number | undefined
  setIdOs: (value: number | undefined) => void
  idWifi: number | undefined
  setIdWifi: (value: number | undefined) => void
  idBluetooth: number | undefined
  setIdBluetooth: (value: number | undefined) => void
  idBattery: number | undefined
  setIdBattery: (value: number | undefined) => void
  idCategory: number | undefined
  setIdCategory: (value: number | undefined) => void
  status: string | undefined
  setStatus: (value: string | undefined) => void
}

export function DataTableToolbar<TData>({
  table: _table,
  searchValue,
  setSearchValue,
  idChip,
  setIdChip,
  idBrand,
  setIdBrand,
  idScreen,
  setIdScreen,
  idCard,
  setIdCard,
  idOs,
  setIdOs,
  idWifi,
  setIdWifi,
  idBluetooth,
  setIdBluetooth,
  idBattery,
  setIdBattery,
  idCategory,
  setIdCategory,
  status,
  setStatus,
}: DataTableToolbarProps<TData>) {
  const data = useFetchData()
  const {
    batteries = [],
    bluetooths = [],
    brands = [],
    cards = [],
    categories = [],
    chips = [],
    os = [],
    screens = [],
    wifis = [],
  } = data

  const handleStatusChange = (value: string) => {
    setStatus(value === 'all' ? undefined : value)
  }

  return (
    <div className='mx-auto space-y-4 rounded border-l border-r px-4 py-4'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 items-center space-x-2'>
          {/* Ô input để nhập mã hoặc tên */}
          <Input
            placeholder='Tìm kiếm theo mã hoặc tên...'
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        </div>
      </div>

      <div className='mb-4 grid grid-cols-5 gap-4'>
        {/* Chip Select */}
        <div className='flex flex-col justify-center'>
          <Label
            htmlFor='chip-select'
            className='mb-1 text-xs text-muted-foreground'
          >
            Chip
          </Label>
          <Select
            value={idChip?.toString()}
            onValueChange={(value) =>
              setIdChip(value === '0' ? undefined : Number(value))
            }
          >
            <SelectTrigger id='chip-select'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>Tất cả</SelectItem>
              {chips.map((chip: AttributeItem) => (
                <SelectItem key={chip.id} value={chip.id.toString()}>
                  {chip.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Brand Select */}
        <div className='flex flex-col justify-center'>
          <Label
            htmlFor='brand-select'
            className='mb-1 text-xs text-muted-foreground'
          >
            Thương hiệu
          </Label>
          <Select
            value={idBrand?.toString()}
            onValueChange={(value) =>
              setIdBrand(value === '0' ? undefined : Number(value))
            }
          >
            <SelectTrigger id='brand-select'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>Tất cả</SelectItem>
              {brands.map((brand: AttributeItem) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Screen Select */}
        <div className='flex flex-col justify-center'>
          <Label
            htmlFor='screen-select'
            className='mb-1 text-xs text-muted-foreground'
          >
            Màn hình
          </Label>
          <Select
            value={idScreen?.toString()}
            onValueChange={(value) =>
              setIdScreen(value === '0' ? undefined : Number(value))
            }
          >
            <SelectTrigger id='screen-select'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>Tất cả</SelectItem>
              {screens.map((screen: AttributeItem) => (
                <SelectItem key={screen.id} value={screen.id.toString()}>
                  {screen.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Card Select */}
        <div className='flex flex-col justify-center'>
          <Label
            htmlFor='card-select'
            className='mb-1 text-xs text-muted-foreground'
          >
            Thẻ nhớ
          </Label>
          <Select
            value={idCard?.toString()}
            onValueChange={(value) =>
              setIdCard(value === '0' ? undefined : Number(value))
            }
          >
            <SelectTrigger id='card-select'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>Tất cả</SelectItem>
              {cards.map((card: AttributeItem) => (
                <SelectItem key={card.id} value={card.id.toString()}>
                  {card.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* OS Select */}
        <div className='flex flex-col justify-center'>
          <Label
            htmlFor='os-select'
            className='mb-1 text-xs text-muted-foreground'
          >
            Hệ điều hành
          </Label>
          <Select
            value={idOs?.toString()}
            onValueChange={(value) =>
              setIdOs(value === '0' ? undefined : Number(value))
            }
          >
            <SelectTrigger id='os-select'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>Tất cả</SelectItem>
              {os.map((osItem: AttributeItem) => (
                <SelectItem key={osItem.id} value={osItem.id.toString()}>
                  {osItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* WiFi Select */}
        <div className='flex flex-col justify-center'>
          <Label
            htmlFor='wifi-select'
            className='mb-1 text-xs text-muted-foreground'
          >
            WiFi
          </Label>
          <Select
            value={idWifi?.toString()}
            onValueChange={(value) =>
              setIdWifi(value === '0' ? undefined : Number(value))
            }
          >
            <SelectTrigger id='wifi-select'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>Tất cả</SelectItem>
              {wifis.map((wifi: AttributeItem) => (
                <SelectItem key={wifi.id} value={wifi.id.toString()}>
                  {wifi.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bluetooth Select */}
        <div className='flex flex-col justify-center'>
          <Label
            htmlFor='bluetooth-select'
            className='mb-1 text-xs text-muted-foreground'
          >
            Bluetooth
          </Label>
          <Select
            value={idBluetooth?.toString()}
            onValueChange={(value) =>
              setIdBluetooth(value === '0' ? undefined : Number(value))
            }
          >
            <SelectTrigger id='bluetooth-select'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>Tất cả</SelectItem>
              {bluetooths.map((bluetooth: AttributeItem) => (
                <SelectItem key={bluetooth.id} value={bluetooth.id.toString()}>
                  {bluetooth.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Battery Select */}
        <div className='flex flex-col justify-center'>
          <Label
            htmlFor='battery-select'
            className='mb-1 text-xs text-muted-foreground'
          >
            Pin
          </Label>
          <Select
            value={idBattery?.toString()}
            onValueChange={(value) =>
              setIdBattery(value === '0' ? undefined : Number(value))
            }
          >
            <SelectTrigger id='battery-select'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>Tất cả</SelectItem>
              {batteries.map((battery: AttributeItem) => (
                <SelectItem key={battery.id} value={battery.id.toString()}>
                  {battery.capacity} mAh
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Select */}
        <div className='flex flex-col justify-center'>
          <Label
            htmlFor='category-select'
            className='mb-1 text-xs text-muted-foreground'
          >
            Danh mục
          </Label>
          <Select
            value={idCategory?.toString()}
            onValueChange={(value) =>
              setIdCategory(value === '0' ? undefined : Number(value))
            }
          >
            <SelectTrigger id='category-select'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>Tất cả</SelectItem>
              {categories.map((category: AttributeItem) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Select */}
        <div className='flex flex-col justify-center'>
          <Label
            htmlFor='status-select'
            className='mb-1 text-xs text-muted-foreground'
          >
            Trạng thái
          </Label>
          <Select value={status || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger id='status-select'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả</SelectItem>
              {STATUS.map((statusOption) => (
                <SelectItem key={statusOption.value} value={statusOption.value}>
                  {statusOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
