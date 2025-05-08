import { useCallback, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Route } from '@/routes/(auth)/dienthoai/index.lazy'
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { Search } from 'lucide-react'
import {
  getBrandActive,
  getCategoryActive,
  getChipActive,
  getOsActive,
  getRamActive,
  getRomActive,
  getScreenActive,
} from '../../../features/product-management/product/data/api-service'

export interface PhoneFilterRequest {
  key?: string
  priceStart?: number
  priceEnd?: number
  brand?: number
  chip?: number
  category?: number
  os?: number
  ram?: number
  rom?: number
  nfc?: boolean | null
  typeScreen?: string
  sizeScreen?: number
  priceMax?: boolean
  priceMin?: boolean
  productSale?: boolean
}

interface BoLocDienThoaiProps {
  onFilterChange: (filters: PhoneFilterRequest) => void
}

// Constants
const DEFAULT_PRICE_RANGE = [0, 50000000]

export default function BoLocDienThoai({
  onFilterChange,
}: BoLocDienThoaiProps) {
  const search = Route.useSearch()

  // Khởi tạo filters từ URL params
  const [filters, setFilters] = useState<PhoneFilterRequest>(() => ({
    key: search.key as string,
    brand: search.brand ? Number(search.brand) : undefined,
    chip: search.chip ? Number(search.chip) : undefined,
    category: search.category ? Number(search.category) : undefined,
    os: search.os ? Number(search.os) : undefined,
    ram: search.ram ? Number(search.ram) : undefined,
    rom: search.rom ? Number(search.rom) : undefined,
    nfc: search.nfc ? Boolean(search.nfc) : undefined,
    typeScreen: search.typeScreen as string,
    priceStart: search.priceStart ? Number(search.priceStart) : undefined,
    priceEnd: search.priceEnd ? Number(search.priceEnd) : undefined,
  }))
  const [searchKey, setSearchKey] = useState(filters.key || '') // State để lưu giá trị input
  const [sortType, setSortType] = useState<{
    priceMax?: boolean
    priceMin?: boolean
    productSale?: boolean
  }>(() => ({
    priceMax: search.priceMax ? Boolean(search.priceMax) : false,
    priceMin: search.priceMin ? Boolean(search.priceMin) : false,
    productSale: search.productSale ? Boolean(search.productSale) : false,
  }))

  const [isPricePopoverOpen, setIsPricePopoverOpen] = useState(false)
  const [isPriceFilterActive, setIsPriceFilterActive] = useState(false)
  const [tempPriceRange, setTempPriceRange] = useState(DEFAULT_PRICE_RANGE)

  // Fetch data
  const { data } = useQuery({
    queryKey: ['filterAttributes'],
    queryFn: async () => {
      try {
        const [brands, chips, categories, os, rams, roms, screens] =
          await Promise.all([
            getBrandActive(),
            getChipActive(),
            getCategoryActive(),
            getOsActive(),
            getRamActive(),
            getRomActive(),
            getScreenActive(),
          ])
        return {
          brands: brands || [],
          chips: chips || [],
          categories: categories || [],
          os: os || [],
          rams: rams || [],
          roms: roms || [],
          screens: screens || [],
        }
      } catch (error) {
        console.error('Error fetching filter data:', error)
        throw error
      }
    },
  })

  // Handle filter change for any attribute
  const handleFilterChange = useCallback(
    (key: keyof PhoneFilterRequest, value: any) => {
      setFilters((prev) => {
        // If value is "all" or undefined, remove the filter
        const newValue =
          value === 'all'
            ? undefined
            : value === 'null'
              ? null
              : typeof value === 'string' &&
                  key !== 'typeScreen' &&
                  key !== 'key'
                ? Number(value)
                : value

        return { ...prev, [key]: newValue }
      })
    },
    []
  )

  // Apply price filter
  const handlePriceChange = useCallback(() => {
    const newFilters = {
      ...filters,
      priceStart: tempPriceRange[0],
      priceEnd: tempPriceRange[1],
    }
    setFilters(newFilters)
    setIsPricePopoverOpen(false)
    setIsPriceFilterActive(true)
  }, [tempPriceRange, filters])

  // Handle sort change
  const handleSortChange = useCallback(
    (type: 'priceMax' | 'priceMin' | 'productSale') => {
      setSortType((prev) => {
        const newSort = {
          priceMax: false,
          priceMin: false,
          productSale: false,
          [type]: !prev[type],
        }
        return newSort
      })
    },
    []
  )

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({})
    setTempPriceRange(DEFAULT_PRICE_RANGE)
    setIsPriceFilterActive(false)
    setSearchKey('')
    setSortType({})
  }, [])

  // Clear price filter only
  const clearPriceFilter = useCallback(() => {
    const { priceStart, priceEnd, ...rest } = filters
    setFilters(rest)
    setTempPriceRange(DEFAULT_PRICE_RANGE)
    setIsPriceFilterActive(false)
  }, [filters])

  // Notify parent component when filters change
  useEffect(() => {
    const fullFilters = {
      ...filters,
      ...sortType,
    }
    onFilterChange(fullFilters)
  }, [filters, sortType, onFilterChange])

  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Helper to get selected item name
  const getSelectedItemName = (
    items: any[] = [],
    id?: number,
    key = 'name',
    suffix?: string // Suffix là tùy chọn
  ) => {
    if (!id) return undefined
    const item = items.find((item) => item.id === id)
    return item
      ? suffix
        ? `${item[key]}${item[suffix]}`
        : `${item[key]}` // Chỉ trả về item[key] nếu không có suffix
      : undefined
  }

  // Check if any filter is active
  const isAnyFilterActive =
    isPriceFilterActive ||
    Object.entries(filters).some(
      ([key, value]) =>
        ![
          'priceStart',
          'priceEnd',
          'priceMax',
          'priceMin',
          'productSale',
        ].includes(key) &&
        value !== undefined &&
        value !== null
    ) ||
    Object.values(sortType).some((value) => value)

  // Create filter controls
  const renderFilterControls = () => (
    <div className='flex flex-wrap gap-3'>
      {/* Price Filter */}
      <Popover
        placement='bottom-start'
        isOpen={isPricePopoverOpen}
        onOpenChange={setIsPricePopoverOpen}
      >
        <PopoverTrigger>
          <Button
            variant={isPriceFilterActive ? 'bordered' : 'flat'}
            color={isPriceFilterActive ? 'primary' : 'default'}
            className={!isPriceFilterActive ? 'bg-gray-100' : ''}
            endContent={<Icon icon='lucide:chevron-down' />}
          >
            Giá
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-80'>
          <div className='p-4'>
            <div className='mb-3 text-small font-bold'>Chọn khoảng giá</div>
            <Slider
              step={500000}
              minValue={0}
              maxValue={50000000}
              value={tempPriceRange}
              onChange={(value) => setTempPriceRange(value as number[])}
              className='min-w-[300px] max-w-full'
              formatOptions={{
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }}
            />
            <div className='mt-2 flex justify-between'>
              <p className='text-small font-medium text-default-500'>
                {formatPrice(tempPriceRange[0])}
              </p>
              <p className='text-small font-medium text-default-500'>
                {formatPrice(tempPriceRange[1])}
              </p>
            </div>
            <div className='mt-4 flex justify-end gap-2'>
              <Button
                size='sm'
                variant='flat'
                onPress={() => setIsPricePopoverOpen(false)}
              >
                Hủy
              </Button>
              <Button size='sm' color='primary' onPress={handlePriceChange}>
                Áp dụng
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* NFC Switch */}
      <Button
        variant={filters.nfc !== undefined ? 'bordered' : 'flat'}
        color={filters.nfc !== undefined ? 'primary' : 'default'}
        className={filters.nfc === undefined ? 'bg-gray-100' : ''}
        endContent={<Icon icon='lucide:chevron-down' />}
        onPress={() => {
          handleFilterChange(
            'nfc',
            filters.nfc === undefined
              ? true
              : filters.nfc === true
                ? false
                : undefined
          )
        }}
      >
        {filters.nfc === undefined
          ? 'NFC'
          : filters.nfc
            ? 'Có NFC'
            : 'Không NFC'}
      </Button>

      {/* Generic dropdown filter component */}
      {[
        {
          label: 'Thương hiệu',
          key: 'brand',
          dataKey: 'brands',
          nameKey: 'name',
        },
        { label: 'Chip', key: 'chip', dataKey: 'chips', nameKey: 'name' },
        {
          label: 'Danh mục',
          key: 'category',
          dataKey: 'categories',
          nameKey: 'name',
        },
        { label: 'Hệ điều hành', key: 'os', dataKey: 'os', nameKey: 'name' },
        {
          label: 'RAM',
          key: 'ram',
          dataKey: 'rams',
          nameKey: 'capacity',
          suffix: 'description',
        },
        {
          label: 'ROM',
          key: 'rom',
          dataKey: 'roms',
          nameKey: 'capacity',
          suffix: 'description',
        },
        {
          label: 'Màn hình',
          key: 'typeScreen',
          dataKey: 'screens',
          nameKey: 'type',
        },
      ].map((filter) => {
        const key = filter.key as keyof PhoneFilterRequest
        const value = filters[key]
        const items = data?.[filter.dataKey as keyof typeof data] || []
        const selectedName =
          key === 'typeScreen'
            ? (value as string)
            : getSelectedItemName(
                items,
                value as number,
                filter.nameKey,
                filter.suffix
              )

        return (
          <Dropdown key={filter.key}>
            <DropdownTrigger>
              <Button
                variant={value ? 'bordered' : 'flat'}
                color={value ? 'primary' : 'default'}
                className={!value ? 'bg-gray-100' : ''}
                endContent={<Icon icon='lucide:chevron-down' />}
              >
                {selectedName || filter.label}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              selectedKeys={value !== undefined ? [value.toString()] : ['all']}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string
                handleFilterChange(
                  key,
                  selected === 'all' ? undefined : selected
                )
              }}
              selectionMode='single'
            >
              <DropdownItem key='all' textValue='Tất cả'>
                Tất cả
              </DropdownItem>
              {items.map((item: any) => (
                <DropdownItem
                  key={key === 'typeScreen' ? item.type : item.id.toString()}
                  textValue={
                    key === 'typeScreen' ? item.type : item[filter.nameKey]
                  }
                >
                  {key === 'typeScreen'
                    ? item.type
                    : filter.suffix
                      ? `${item[filter.nameKey]}${item[filter.suffix]}`
                      : item[filter.nameKey]}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )
      })}
    </div>
  )

  // Create active filters chips
  const renderActiveFilters = () => (
    <div className='mb-6'>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-gray-900'>Đang lọc theo</h2>
        <Button
          variant='ghost'
          color='danger'
          onPress={clearAllFilters}
          size='sm'
        >
          Bỏ chọn tất cả
        </Button>
      </div>
      <div className='flex flex-wrap gap-2'>
        {/* Price filter chip */}
        {filters.key && (
          <Chip
            key='search-keyword'
            onClose={() => handleFilterChange('key', undefined)}
            variant='flat'
            color='primary'
          >
            {`Từ khóa: ${filters.key}`}
          </Chip>
        )}
        {isPriceFilterActive && (
          <Chip
            key='price-range'
            onClose={clearPriceFilter}
            variant='flat'
            color='primary'
          >
            {`Giá: ${formatPrice(filters.priceStart || 0)} - ${formatPrice(filters.priceEnd || 0)}`}
          </Chip>
        )}

        {/* NFC filter chip */}
        {filters.nfc !== undefined && (
          <Chip
            key='nfc'
            onClose={() => handleFilterChange('nfc', undefined)}
            variant='flat'
            color='primary'
          >
            {filters.nfc ? 'Có NFC' : 'Không NFC'}
          </Chip>
        )}

        {/* Dynamic filter chips */}
        {[
          { key: 'brand', label: '', dataKey: 'brands', nameKey: 'name' },
          { key: 'chip', label: '', dataKey: 'chips', nameKey: 'name' },
          {
            key: 'category',
            label: '',
            dataKey: 'categories',
            nameKey: 'name',
          },
          { key: 'os', label: '', dataKey: 'os', nameKey: 'name' },
          {
            key: 'ram',
            label: 'RAM: ',
            dataKey: 'rams',
            nameKey: 'capacity',
            suffix: 'description',
          },
          {
            key: 'rom',
            label: 'ROM: ',
            dataKey: 'roms',
            nameKey: 'capacity',
            suffix: 'description',
          },
          { key: 'typeScreen', label: 'Màn hình: ' },
        ].map((filter) => {
          const key = filter.key as keyof PhoneFilterRequest
          const value = filters[key]

          if (value === undefined || value === null) return null

          let displayText = ''
          if (key === 'typeScreen') {
            displayText = `${filter.label}${value}`
          } else {
            const items = data?.[filter.dataKey as keyof typeof data] || []
            const item = items.find((i: any) => i.id === value)
            if (!item) return null

            displayText = `${filter.label}${item[filter.nameKey]}${item[filter.suffix] || ''}`
          }

          return (
            <Chip
              key={key}
              onClose={() => handleFilterChange(key, undefined)}
              variant='flat'
              color='primary'
            >
              {displayText}
            </Chip>
          )
        })}

        {/* Sort type chips */}
        {Object.entries(sortType)
          .filter(([_, value]) => value)
          .map(([key]) => (
            <Chip
              key={key}
              onClose={() =>
                handleSortChange(key as 'priceMax' | 'priceMin' | 'productSale')
              }
              variant='flat'
              color='primary'
            >
              {key === 'priceMax'
                ? 'Giá Cao - Thấp'
                : key === 'priceMin'
                  ? 'Giá Thấp - Cao'
                  : 'Khuyến Mãi Hot'}
            </Chip>
          ))}
      </div>
    </div>
  )

  // Create sort controls
  const renderSortControls = () => (
    <div className='mb-8 flex flex-wrap items-center gap-4'>
      <span className='text-gray-700'>Sắp xếp theo:</span>
      {[
        { key: 'priceMax', label: 'Giá Cao - Thấp', icon: 'lucide:arrow-down' },
        { key: 'priceMin', label: 'Giá Thấp - Cao', icon: 'lucide:arrow-up' },
        { key: 'productSale', label: 'Khuyến Mãi Hot', icon: 'lucide:percent' },
      ].map((sort) => (
        <Button
          key={sort.key}
          variant={
            sortType[sort.key as keyof typeof sortType] ? 'bordered' : 'flat'
          }
          color={
            sortType[sort.key as keyof typeof sortType] ? 'primary' : 'default'
          }
          startContent={<Icon icon={sort.icon} />}
          onPress={() =>
            handleSortChange(
              sort.key as 'priceMax' | 'priceMin' | 'productSale'
            )
          }
        >
          {sort.label}
        </Button>
      ))}
    </div>
  )

  return (
    <div className='mx-auto max-w-7xl'>
      <div className='mb-8'>
        <h1 className='mb-4 text-xl font-bold text-gray-900'>
          Chọn theo tiêu chí
        </h1>
        {renderFilterControls()}
      </div>

      {isAnyFilterActive && renderActiveFilters()}

      {renderSortControls()}

      {/* tim kiem  */}
      <div className='mb-8 flex w-full justify-center'>
        <div className='flex w-5/6 max-w-3xl items-center gap-4'>
          <input
            type='text'
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder='Tìm kiếm điện thoại...'
            className='flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500'
          />
          <Button
            variant='bordered'
            color='primary'
            isDisabled={!searchKey.trim()}
            onPress={() => handleFilterChange('key', searchKey.trim())}
            className='flex items-center gap-2'
          >
            <Search className='h-5 w-5' />
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  )
}
