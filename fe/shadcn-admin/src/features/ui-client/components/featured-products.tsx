import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { IconLoader2 } from '@tabler/icons-react'
import { Heart, Star } from 'lucide-react'
import { getHome } from '../data/api-service'
import { productViewResponse } from '../data/schema'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<productViewResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const data = await getHome()
        setProducts(data)
      } catch (error) {
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }
    fetchHome()
  }, [])

  if (loading)
    return (
      <div className='flex h-full items-center justify-center'>
        <IconLoader2 className='h-8 w-8 animate-spin' />
      </div>
    )

  if (error)
    return (
      <div className='mt-9 flex h-screen items-center justify-center text-2xl'>
        Lỗi: {error.message}
      </div>
    )

  return (
    <section className='container py-10'>
      <div className='mb-8 flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>Điện thoại mới nhất</h2>
        <Button variant='outline' asChild>
          <Link to='/'>Xem tất cả</Link>
        </Button>
      </div>
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {products.map((product) => (
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
                      ((product.price - product.priceSeller) / product.price) *
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

                {/* Hiển thị RAM và ROM trên cùng 1 hàng với dấu / */}
                <div className='flex items-center gap-2'>
                  {product.ram.map((ram, i) => (
                    <div
                      key={`ram-${i}`}
                      className='flex h-6 w-auto min-w-[40px] items-center justify-center rounded-md border bg-gray-100 px-2 text-sm shadow-sm'
                    >
                      {ram}GB
                    </div>
                  ))}
                  {/* <span className='text-sm font-medium text-gray-600'>/</span> */}
                  {product.rom.map((rom, i) => (
                    <div
                      key={`rom-${i}`}
                      className='flex h-6 w-auto min-w-[40px] items-center justify-center rounded-md border bg-gray-100 px-2 text-sm shadow-sm'
                    >
                      {rom}GB
                    </div>
                  ))}
                </div>

                {/* Hiển thị màu sắc */}
                <div className='flex gap-1.5'>
                  {product.hex.map((color, i) => (
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
              {/* Giá bán và giá gốc */}
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

              {/* Hai button trên cùng một hàng, riêng biệt */}
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
        ))}
      </div>
    </section>
  )
}
