import React, { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
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
  priceStart: number
  priceEnd: number
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

export default function BoLocDienThoai({ onFilterChange }: BoLocDienThoaiProps) {
  // State initialization
  const [filters, setFilters] = useState<PhoneFilterRequest>({
    priceStart: DEFAULT_PRICE_RANGE[0],
    priceEnd: DEFAULT_PRICE_RANGE[1],
  })
  
  const [isPricePopoverOpen, setIsPricePopoverOpen] = useState(false)
  const [isPriceFilterActive, setIsPriceFilterActive] = useState(false)
  const [tempPriceRange, setTempPriceRange] = useState(DEFAULT_PRICE_RANGE)
  const [sortType, setSortType] = useState<{
    priceMax?: boolean
    priceMin?: boolean
    productSale?: boolean
  }>({})

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
        console.error("Error fetching filter data:", error)
        throw error
      }
    },
  })

  // Handle filter change for any attribute
  const handleFilterChange = useCallback((key: keyof PhoneFilterRequest, value: any) => {
    setFilters(prev => {
      // If value is "all" or undefined, remove the filter
      const newValue = value === 'all' ? undefined : 
                        typeof value === 'string' && key !== 'typeScreen' ? Number(value) : value
      
      return { ...prev, [key]: newValue }
    })
  }, [])

  // Apply price filter
  const handlePriceChange = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      priceStart: tempPriceRange[0],
      priceEnd: tempPriceRange[1]
    }))
    setIsPricePopoverOpen(false)
    setIsPriceFilterActive(true)
  }, [tempPriceRange])

  // Handle sort change
  const handleSortChange = useCallback((type: 'priceMax' | 'priceMin' | 'productSale') => {
    setSortType(prev => {
      const newSort = {
        priceMax: false,
        priceMin: false,
        productSale: false,
      }
      newSort[type] = !prev[type]
      return newSort
    })
  }, [])

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({
      priceStart: DEFAULT_PRICE_RANGE[0],
      priceEnd: DEFAULT_PRICE_RANGE[1],
    })
    setTempPriceRange(DEFAULT_PRICE_RANGE)
    setIsPriceFilterActive(false)
    setSortType({})
  }, [])

  // Clear price filter only
  const clearPriceFilter = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      priceStart: DEFAULT_PRICE_RANGE[0],
      priceEnd: DEFAULT_PRICE_RANGE[1]
    }))
    setTempPriceRange(DEFAULT_PRICE_RANGE)
    setIsPriceFilterActive(false)
  }, [])

  // Notify parent component when filters change
  useEffect(() => {
    const fullFilters = {
      ...filters,
      ...sortType
    }
    
    if (Object.values(fullFilters).some(value => value !== undefined && value !== null)) {
      onFilterChange(fullFilters)
    }
  }, [filters, sortType, onFilterChange])


  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  // Helper to get selected item name
  const getSelectedItemName = (items: any[] = [], id?: number, key = 'name', suffix = '') => {
    if (!id) return undefined
    const item = items.find(item => item.id === id)
    return item ? `${item[key]}${suffix}` : undefined
  }

  // Check if any filter is active
  const isAnyFilterActive = 
    isPriceFilterActive || 
    Object.entries(filters).some(([key, value]) => 
      key !== 'priceStart' && 
      key !== 'priceEnd' && 
      value !== undefined && 
      value !== null) ||
    Object.values(sortType).some(value => value)

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
          // Toggle between true, false and undefined
          handleFilterChange('nfc', filters.nfc === undefined ? true : 
                                    filters.nfc === true ? false : undefined)
        }}
      >
        {filters.nfc === undefined 
          ? 'NFC' 
          : filters.nfc 
            ? 'Có NFC'
            : 'Không NFC'
        }
      </Button>

      {/* Generic dropdown filter component */}
      {[
        { label: 'Thương hiệu', key: 'brand', dataKey: 'brands', nameKey: 'name' },
        { label: 'Chip', key: 'chip', dataKey: 'chips', nameKey: 'name' },
        { label: 'Danh mục', key: 'category', dataKey: 'categories', nameKey: 'name' },
        { label: 'Hệ điều hành', key: 'os', dataKey: 'os', nameKey: 'name' },
        { label: 'RAM', key: 'ram', dataKey: 'rams', nameKey: 'capacity', suffix: 'GB' },
        { label: 'ROM', key: 'rom', dataKey: 'roms', nameKey: 'capacity', suffix: 'GB' },
        { label: 'Màn hình', key: 'typeScreen', dataKey: 'screens', nameKey: 'type' },
      ].map(filter => {
        const key = filter.key as keyof PhoneFilterRequest
        const value = filters[key]
        const items = data?.[filter.dataKey as keyof typeof data] || []
        const selectedName = key === 'typeScreen' 
          ? value as string
          : getSelectedItemName(items, value as number, filter.nameKey, filter.suffix)

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
              selectedKeys={value ? [value.toString()] : ['all']}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string
                handleFilterChange(key, selected)
              }}
              selectionMode='single'
            >
              <DropdownItem key='all' textValue='Tất cả'>
                Tất cả
              </DropdownItem>
              {items.map((item: any) => (
                <DropdownItem 
                  key={key === 'typeScreen' ? item.type : item.id.toString()} 
                  textValue={key === 'typeScreen' ? item.type : item[filter.nameKey]}
                >
                  {key === 'typeScreen' 
                    ? item.type 
                    : filter.suffix 
                      ? `${item[filter.nameKey]}${filter.suffix}`
                      : item[filter.nameKey]
                  }
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
        <h2 className='text-lg font-semibold text-gray-900'>
          Đang lọc theo
        </h2>
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
        {isPriceFilterActive && (
          <Chip
            key='price-range'
            onClose={clearPriceFilter}
            variant='flat'
            color='primary'
            className='bg-red-50'
          >
            {`Giá: ${formatPrice(filters.priceStart)} - ${formatPrice(filters.priceEnd)}`}
          </Chip>
        )}

        {/* NFC filter chip */}
        {filters.nfc !== undefined && (
          <Chip
            key='nfc'
            onClose={() => handleFilterChange('nfc', undefined)}
            variant='flat'
            color='primary'
            className='bg-red-50'
          >
            {filters.nfc ? 'Có NFC' : 'Không NFC'}
          </Chip>
        )}

        {/* Dynamic filter chips */}
        {[
          { key: 'brand', label: '', dataKey: 'brands', nameKey: 'name' },
          { key: 'chip', label: '', dataKey: 'chips', nameKey: 'name' },
          { key: 'category', label: '', dataKey: 'categories', nameKey: 'name' },
          { key: 'os', label: '', dataKey: 'os', nameKey: 'name' },
          { key: 'ram', label: 'RAM: ', dataKey: 'rams', nameKey: 'capacity', suffix: 'GB' },
          { key: 'rom', label: 'ROM: ', dataKey: 'roms', nameKey: 'capacity', suffix: 'GB' },
          { key: 'typeScreen', label: 'Màn hình: ' },
        ].map(filter => {
          const key = filter.key as keyof PhoneFilterRequest
          const value = filters[key]
          
          if (!value) return null

          let displayText = ''
          if (key === 'typeScreen') {
            displayText = `${filter.label}${value}`
          } else {
            const items = data?.[filter.dataKey as keyof typeof data] || []
            const item = items.find((i: any) => i.id === value)
            if (!item) return null
            
            displayText = `${filter.label}${item[filter.nameKey]}${filter.suffix || ''}`
          }

          return (
            <Chip
              key={key}
              onClose={() => handleFilterChange(key, undefined)}
              variant='flat'
              color='primary'
              className='bg-red-50'
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
              onClose={() => handleSortChange(key as 'priceMax' | 'priceMin' | 'productSale')}
              variant='flat'
              color='primary'
              className='bg-red-50'
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
        { key: 'productSale', label: 'Khuyến Mãi Hot', icon: 'lucide:percent' }
      ].map(sort => (
        <Button
          key={sort.key}
          variant={sortType[sort.key as keyof typeof sortType] ? 'bordered' : 'flat'}
          color={sortType[sort.key as keyof typeof sortType] ? 'primary' : 'default'}
          startContent={<Icon icon={sort.icon} />}
          onPress={() => handleSortChange(sort.key as 'priceMax' | 'priceMin' | 'productSale')}
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
    </div>
  )
}