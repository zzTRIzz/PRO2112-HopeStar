import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { IconLoader2 } from '@tabler/icons-react'
import { Heart, Star } from 'lucide-react'
import { getHome, searchPhones } from '../data/api-service'
import { productViewResponse } from '../data/schema'
import { Breadcrumb } from '../pages/breadcrumb'
import BoLocDienThoai, { PhoneFilterRequest } from './bo-loc-dien-thoai'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'

export default function TatCaDienThoai() {
  const [products, setProducts] = useState<productViewResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [displayLimit, setDisplayLimit] = useState(20)

  // Add state to track if filters are active
  const [isFiltered, setIsFiltered] = useState(false)

  const handleFilterChange = async (filters: PhoneFilterRequest) => {
    try {
      // Check if any filter is active
      const hasActiveFilters =
        filters.priceStart !== 0 ||
        filters.priceEnd !== 50000000 ||
        filters.brand ||
        filters.chip ||
        filters.category ||
        filters.os ||
        filters.priceMax ||
        filters.priceMin ||
        filters.productSale

      setIsFiltered(hasActiveFilters)

      if (!hasActiveFilters) {
        // If no filters active, fetch home data
        const data = await getHome()
        setProducts(data.newestProducts)
      } else {
        // Otherwise fetch filtered data
        const data = await searchPhones(filters)
        setProducts(data)
      }
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  // useEffect(() => {
  //   const fetchHome = async () => {
  //     try {
  //       const data = await getHome()
  //       setProducts(data.newestProducts)
  //     } catch (error) {
  //       setError(error as Error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchHome()
  // }, [])

  // if (loading)
  //   return (
  //     <div className='flex h-full items-center justify-center'>
  //       <IconLoader2 className='h-8 w-8 animate-spin' />
  //     </div>
  //   )

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
                className='group flex flex-col overflow-hidden'
              >
                <Link to={`/product/${product.idProduct}`} className='flex-1'>
                  <CardHeader className='relative aspect-square flex-1 p-0'>
                    <div className='flex h-full w-full items-center justify-center'>
                      <img
                        src={product.image}
                        alt={product.name}
                        className='h-48 w-48 transform object-contain p-4 transition-transform duration-300 group-hover:scale-105'
                      />
                    </div>

                    <div className='absolute right-2 top-2 flex gap-2'>
                      <Button
                        variant='secondary'
                        size='icon'
                        className='rounded-full opacity-70 shadow-sm transition-opacity hover:opacity-100'
                      >
                        <Heart className='h-4 w-4' />
                      </Button>
                    </div>

                    {product.price !== product.priceSeller && (
                      <Badge
                        variant='destructive'
                        className='absolute left-2 top-1 px-2 py-1 text-xs'
                      >
                        Giảm{' '}
                        {(
                          ((product.price - product.priceSeller) /
                            product.price) *
                          100
                        ).toFixed(0)}{' '}
                        %
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className='flex flex-col gap-2 p-2'>
                    <div className='flex items-start justify-between'>
                      <h3 className='line-clamp-2 text-base font-semibold leading-tight'>
                        {product.name}
                      </h3>
                      <div className='flex shrink-0 items-center gap-1'>
                        <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                        <span className='text-sm font-medium'>4.8</span>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      {product.ram?.map((ram, i) => (
                        <div
                          key={`ram-${i}`}
                          className='flex h-6 w-auto min-w-[40px] items-center justify-center rounded-md border bg-gray-100 px-2 text-sm shadow-sm'
                        >
                          {ram}GB
                        </div>
                      ))}
                      {product.rom?.map((rom, i) => (
                        <div
                          key={`rom-${i}`}
                          className='flex h-6 w-auto min-w-[40px] items-center justify-center rounded-md border bg-gray-100 px-2 text-sm shadow-sm'
                        >
                          {rom}GB
                        </div>
                      ))}
                    </div>

                    <div className='flex gap-1.5'>
                      {product.hex?.map((color, i) => (
                        <div
                          key={i}
                          className='h-4 w-4 rounded-full border border-muted shadow-sm'
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Link>

                <CardFooter className='flex flex-col gap-3 px-2 py-4 pt-0'>
                  <div className='flex items-center gap-2'>
                    <div className='text-lg font-bold text-red-600'>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(product.priceSeller)}
                    </div>
                    {product.price !== product.priceSeller && (
                      <div className='text-sm font-medium text-gray-500 line-through'>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(product.price)}
                      </div>
                    )}
                  </div>

                  <div className='flex justify-end gap-2'>
                    <Button
                      size='lg'
                      variant='outline'
                      className='h-8 border-gray-300 px-4 text-xs text-gray-700 hover:bg-gray-100'
                    >
                      Thêm giỏ
                    </Button>
                    <Button
                      size='lg'
                      className='h-8 bg-gradient-to-r from-blue-500 to-blue-700 px-4 text-xs text-white hover:from-blue-600 hover:to-blue-800'
                    >
                      Mua ngay
                    </Button>
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
