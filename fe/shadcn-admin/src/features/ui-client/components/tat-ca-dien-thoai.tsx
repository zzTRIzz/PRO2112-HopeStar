import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate} from '@tanstack/react-router'
import { getHome, searchPhones } from '../data/api-service'
import { productViewResponse } from '../data/schema'
import { Breadcrumb } from '../pages/breadcrumb'
import BoLocDienThoai, { PhoneFilterRequest } from './bo-loc-dien-thoai'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Route } from '@/routes/(auth)/dienthoai/index.lazy'
import { useQuery } from '@tanstack/react-query'

export default function TatCaDienThoai() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const [products, setProducts] = useState<productViewResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [displayLimit, setDisplayLimit] = useState(15)

  // Add state to track if filters are active
  const [isFiltered, setIsFiltered] = useState(false)

  // Xử lý initial filters từ URL khi component mount
  // Track if this is the initial load
  const initialLoadRef = useRef(true)

  // Fetch home data using React Query
  const { data: homeData } = useQuery({
    queryKey: ['home'],
    queryFn: getHome,
    enabled: !Object.keys(search).length || initialLoadRef.current,
    onSuccess: (data) => {
      if (initialLoadRef.current && !Object.keys(search).length) {
        setProducts(data.newestProducts)
        setLoading(false)
        initialLoadRef.current = false
      }
    },
    onError: (error) => {
      setError(error as Error)
      setLoading(false)
    },
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  })

  // Process search parameters on initial load
  useEffect(() => {
    if (initialLoadRef.current && Object.keys(search).length > 0) {
      const initialFilters: PhoneFilterRequest = {
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
        priceMax: search.priceMax ? Boolean(search.priceMax) : undefined,
        priceMin: search.priceMin ? Boolean(search.priceMin) : undefined,
        productSale: search.productSale
          ? Boolean(search.productSale)
          : undefined,
      }
      
      handleFilterChange(initialFilters)
      initialLoadRef.current = false
    }
  }, [search]);

  // Debounce handler to prevent excessive API calls
  const debouncedFilterChange = useCallback((filters: PhoneFilterRequest) => {
    // Update URL with filters
    const searchParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, value.toString())
      }
    })

    // Update URL without reloading page
    navigate({
      search: searchParams.toString(),
      replace: true,
    })

    // Check if any filter is active
    const hasActiveFilters = Object.values(filters).some(
      (value) => value !== undefined && value !== null
    )

    setIsFiltered(hasActiveFilters)
    setLoading(true)

    // Use different data sources based on filter state
    if (!hasActiveFilters) {
      // Use cached data if available, otherwise fetch
      if (homeData) {
        setProducts(homeData.newestProducts)
        setLoading(false)
      } else {
        getHome()
          .then((data) => {
            setProducts(data.newestProducts)
          })
          .catch((error) => {
            setError(error as Error)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    } else {
      searchPhones(filters)
        .then((data) => {
          setProducts(data)
        })
        .catch((error) => {
          setError(error as Error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [navigate, homeData])

  // Debounce timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Handle filter changes with debouncing
  const handleFilterChange = useCallback((filters: PhoneFilterRequest) => {
    // Clear previous timer if it exists
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Set new timer (300ms delay)
    timerRef.current = setTimeout(() => {
      debouncedFilterChange(filters)
    }, 300)
  }, [debouncedFilterChange])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])
  if (error)
    return (
      <div className='mt-9 flex h-screen items-center justify-center text-2xl'>
        Lỗi: {error.message}
      </div>
    )

  return (
    <>
      <Breadcrumb items={[{ label: 'Điện thoại' }]} />
      <section className='container py-2'>
        <BoLocDienThoai onFilterChange={handleFilterChange} />
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          {products?.length > 0 ? (
            products.slice(0, displayLimit).map((product) => (
              <Card
                key={product.idProduct}
                className="group flex h-full flex-col overflow-hidden bg-white transition-shadow hover:shadow-lg"
              >
                <Link to={`/product/${product.idProduct}`} className="flex-1">
                  <CardHeader className="relative aspect-square p-0">
                    {/* Product Image */}
                    <div className="flex h-full w-full items-center justify-center p-2 sm:p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-32 w-32 sm:h-48 sm:w-48 object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
              
                    {/* Discount Badge */}
                    {product.price !== product.priceSeller && (
                      <Badge
                        variant="destructive"
                        className="absolute left-2 top-2 px-1.5 py-0.5 text-[10px] sm:text-xs sm:px-2 sm:py-1"
                      >
                        Giảm {Math.round(((product.price - product.priceSeller) / product.price) * 100)}%
                      </Badge>
                    )}
                  </CardHeader>
              
                  <CardContent className="flex flex-col gap-1.5 sm:gap-2 p-2 sm:p-3">
                    {/* Product Name */}
                    <h3 className="line-clamp-2 text-sm sm:text-base font-semibold leading-tight">
                      {product.name}
                    </h3>
              
                    {/* Specs */}
                    <div className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      {/* RAM */}
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <span className="font-medium text-gray-500">Ram:</span>
                        <div className="flex flex-wrap gap-1">
                          {product.ram.map((ram, i) => (
                            <div
                              key={`ram-${i}`}
                              className="flex h-5 sm:h-6 min-w-[32px] sm:min-w-[40px] items-center justify-center rounded border bg-blue-50 px-1 sm:px-2 text-xs font-medium text-blue-700"
                            >
                              {ram}
                            </div>
                          ))}
                        </div>
                      </div>
              
                      {/* ROM */}
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <span className="font-medium text-gray-500">Rom:</span>
                        <div className="flex flex-wrap gap-1">
                          {product.rom.map((rom, i) => (
                            <div
                              key={`rom-${i}`}
                              className="flex h-5 sm:h-6 min-w-[32px] sm:min-w-[40px] items-center justify-center rounded border bg-green-50 px-1 sm:px-2 text-xs font-medium text-green-700"
                            >
                              {rom}
                            </div>
                          ))}
                        </div>
                      </div>
              
                      {/* Colors */}
                      <div className="flex gap-1 sm:gap-1.5">
                        {product.hex.map((color, i) => (
                          <div
                            key={`color-${i}`}
                            className="h-3 w-3 sm:h-4 sm:w-4 rounded-full border border-muted shadow-sm"
                            style={{ backgroundColor: color }}
                            aria-label={`Màu ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Link>
              
                {/* Price and Actions */}
                <CardFooter className="flex flex-col gap-2 sm:gap-3 p-2 sm:p-3 pt-0">
                  {/* Price */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <div className="text-base sm:text-lg font-bold text-red-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(product.priceSeller)}
                    </div>
                    {product.price !== product.priceSeller && (
                      <div className="text-xs sm:text-sm font-medium text-gray-500 line-through">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(product.price)}
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className='col-span-full py-10 text-center'>
              <p className='text-lg text-gray-500'>
                Không có sản phẩm nào để hiển thị
              </p>
            </div>
          )}
        </div>

        {products.length > displayLimit && (
          <div className='mt-6 flex justify-center'>
            <Button
              variant='outline'
              onClick={() => setDisplayLimit((prev) => prev + 5)}
              className='px-8'
            >
              Xem thêm
            </Button>
          </div>
        )}
      </section>
    </>
  )
}
