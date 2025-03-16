import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getBattery } from '../../attribute/battery/data/api-service';
import { getBluetooth } from '../../attribute/bluetooth/data/api-service';
import { getBrand } from '../../attribute/brand/data/api-service';
import { getCard } from '../../attribute/card/data/api-service';
import { getCategory } from '../../attribute/category/data/api-service';
import { getChip } from '../../attribute/chip/data/api-service';
import { getOs } from '../../attribute/os/data/api-service';
import { getScreen } from '../../attribute/screen/data/api-service';
import { getWifi } from '../../attribute/wifi/data/api-service';
import { useQuery } from '@tanstack/react-query';

// Định nghĩa kiểu dữ liệu cho các thuộc tính
interface AttributeItem {
  id: number;
  name: string;
}

interface AttributeData {
  batteries: AttributeItem[];
  bluetooths: AttributeItem[];
  brands: AttributeItem[];
  cards: AttributeItem[];
  categories: AttributeItem[];
  chips: AttributeItem[];
  os: AttributeItem[];
  screens: AttributeItem[];
  wifis: AttributeItem[];
}

const useFetchData = () => {
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
      ])

      return {
        batteries,
        bluetooths,
        brands,
        cards,
        categories,
        chips,
        os,
        screens,
        wifis,
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
    }
  )
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchValue: string;
  setSearchValue: (value: string) => void;
  idChip: number | undefined;
  setIdChip: (value: number | undefined) => void;
  idBrand: number | undefined;
  setIdBrand: (value: number | undefined) => void;
  idScreen: number | undefined;
  setIdScreen: (value: number | undefined) => void;
  idCard: number | undefined;
  setIdCard: (value: number | undefined) => void;
  idOs: number | undefined;
  setIdOs: (value: number | undefined) => void;
  idWifi: number | undefined;
  setIdWifi: (value: number | undefined) => void;
  idBluetooth: number | undefined;
  setIdBluetooth: (value: number | undefined) => void;
  idBattery: number | undefined;
  setIdBattery: (value: number | undefined) => void;
  idCategory: number | undefined;
  setIdCategory: (value: number | undefined) => void;
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
}: DataTableToolbarProps<TData>) {
  const data = useFetchData();
  const { batteries, bluetooths, brands, cards, categories, chips, os, screens, wifis } = data;

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 items-center space-x-2'>
          {/* Ô input để nhập mã hoặc tên */}
          <Input
            placeholder='Lọc theo mã hoặc tên...'
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        </div>
      </div>

      <div className='grid grid-cols-5 gap-4 mb-4'>
        {/* Hàng 1: 5 Select */}
        {/* Select input cho Chip */}
        <div className='flex flex-col justify-center'>
          <Label htmlFor="chip-select" className="mb-1 text-xs">Chip</Label>
          <Select
            value={idChip?.toString()}
            onValueChange={(value) => setIdChip(value === "0" ? undefined : Number(value))}
          >
            <SelectTrigger id="chip-select" className='h-8 w-[160px]'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              {chips.map((chip: AttributeItem) => (
                <SelectItem key={chip.id} value={chip.id.toString()}>
                  {chip.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select input cho Brand */}
        <div className='flex flex-col justify-center'>
          <Label htmlFor="brand-select" className="mb-1 text-xs">Thương hiệu</Label>
          <Select
            value={idBrand?.toString()}
            onValueChange={(value) => setIdBrand(value === "0" ? undefined : Number(value))}
          >
            <SelectTrigger id="brand-select" className='h-8 w-[160px]'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              {brands.map((brand: AttributeItem) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select input cho Screen */}
        <div className='flex flex-col justify-center'>
          <Label htmlFor="screen-select" className="mb-1 text-xs">Màn hình</Label>
          <Select
            value={idScreen?.toString()}
            onValueChange={(value) => setIdScreen(value === "0" ? undefined : Number(value))}
          >
            <SelectTrigger id="screen-select" className='h-8 w-[160px]'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              {screens.map((screen: AttributeItem) => (
                <SelectItem key={screen.id} value={screen.id.toString()}>
                  {screen.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select input cho Card */}
        <div className='flex flex-col justify-center'>
          <Label htmlFor="card-select" className="mb-1 text-xs">Card đồ họa</Label>
          <Select
            value={idCard?.toString()}
            onValueChange={(value) => setIdCard(value === "0" ? undefined : Number(value))}
          >
            <SelectTrigger id="card-select" className='h-8 w-[160px]'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              {cards.map((card: AttributeItem) => (
                <SelectItem key={card.id} value={card.id.toString()}>
                  {card.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select input cho OS */}
        <div className='flex flex-col justify-center'>
          <Label htmlFor="os-select" className="mb-1 text-xs">Hệ điều hành</Label>
          <Select
            value={idOs?.toString()}
            onValueChange={(value) => setIdOs(value === "0" ? undefined : Number(value))}
          >
            <SelectTrigger id="os-select" className='h-8 w-[160px]'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              {os.map((osItem: AttributeItem) => (
                <SelectItem key={osItem.id} value={osItem.id.toString()}>
                  {osItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-4 gap-4 mb-4 w-5/6'>
        {/* Hàng 2: 4 Select */}
        {/* Select input cho WiFi */}
        <div className='flex flex-col justify-center'>
          <Label htmlFor="wifi-select" className="mb-1 text-xs">WiFi</Label>
          <Select
            value={idWifi?.toString()}
            onValueChange={(value) => setIdWifi(value === "0" ? undefined : Number(value))}
          >
            <SelectTrigger id="wifi-select" className='h-8 w-[160px]'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              {wifis.map((wifi: AttributeItem) => (
                <SelectItem key={wifi.id} value={wifi.id.toString()}>
                  {wifi.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select input cho Bluetooth */}
        <div className='flex flex-col justify-center'>
          <Label htmlFor="bluetooth-select" className="mb-1 text-xs">Bluetooth</Label>
          <Select
            value={idBluetooth?.toString()}
            onValueChange={(value) => setIdBluetooth(value === "0" ? undefined : Number(value))}
          >
            <SelectTrigger id="bluetooth-select" className='h-8 w-[160px]'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              {bluetooths.map((bluetooth: AttributeItem) => (
                <SelectItem key={bluetooth.id} value={bluetooth.id.toString()}>
                  {bluetooth.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select input cho Battery */}
        <div className='flex flex-col justify-center'>
          <Label htmlFor="battery-select" className="mb-1 text-xs">Pin</Label>
          <Select
            value={idBattery?.toString()}
            onValueChange={(value) => setIdBattery(value === "0" ? undefined : Number(value))}
          >
            <SelectTrigger id="battery-select" className='h-8 w-[160px]'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              {batteries.map((battery: AttributeItem) => (
                <SelectItem key={battery.id} value={battery.id.toString()}>
                  {battery.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select input cho Category */}
        <div className='flex flex-col justify-center'>
          <Label htmlFor="category-select" className="mb-1 text-xs">Danh mục</Label>
          <Select
            value={idCategory?.toString()}
            onValueChange={(value) => setIdCategory(value === "0" ? undefined : Number(value))}
          >
            <SelectTrigger id="category-select" className='h-8 w-[160px]'>
              <SelectValue placeholder='Tất cả' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              {categories.map((category: AttributeItem) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}