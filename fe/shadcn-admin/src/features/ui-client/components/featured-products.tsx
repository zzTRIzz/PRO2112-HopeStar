import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { IconLoader2 } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { addProductToCart } from '../data/api-cart-service'
import { getHome } from '../data/api-service'
import {
  productViewResponse,
  productViewResponseAllSchema,
} from '../data/schema'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'

export default function FeaturedProducts() {
  const [newestProducts, setNewestProducts] = useState<productViewResponse[]>(
    []
  )
  const [bestSellingProducts, setBestSellingProducts] = useState<
    productViewResponse[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [displayLimit, setDisplayLimit] = useState(10)

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const addToCart = async (idProductDetail: number | undefined) => {
    try {
      if (!idProductDetail) {
        toast({
          title: 'Lỗi',
          description: 'Không thể thêm sản phẩm vào giỏ hàng',
          variant: 'destructive',
        })
        return
      }

      await addProductToCart(idProductDetail, 1)

      toast({
        title: 'Thành công',
        description: 'Đã thêm sản phẩm vào giỏ hàng',
      })

      await queryClient.invalidateQueries({ queryKey: ['cart'] })
    } catch (error) {
      console.error('Add to cart error:', error)
      toast({
        title: 'Thông báo',
        description:
          error?.response?.data?.message ||
          'Không thể thêm sản phẩm vào giỏ hàng',
        variant: 'destructive',
      })

      if (
        error?.response?.data?.message ===
        'Tài khoản của bạn đã bị khóa. Hãy liên hệ với chúng tôi!'
      ) {
        Cookies.remove('jwt')
        localStorage.removeItem('profile')
        navigate({ to: '/sign-in' })
      }
    }
  }

  // Add new function for buy now
  const handleBuyNow = async (idProductDetail: number | undefined) => {
    try {
      if (!idProductDetail) {
        toast({
          title: 'Lỗi',
          description: 'Không thể mua sản phẩm này',
          variant: 'destructive',
        })
        return
      }

      // Add to cart first
      const data = await addProductToCart(idProductDetail, 1)
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
      const cartItems = data?.cartDetailResponseList || []

      console.log('Buy now data:', cartItems)
      const addedProduct = cartItems[0]

      if (!addedProduct) {
        throw new Error('Giỏ hàng đã tồn tại sản phẩm này')
      }

      // Navigate to checkout with only this product
      navigate({
        to: '/dat-hang',
        search: {
          selectedProducts: JSON.stringify([addedProduct]),
        },
      })
    } catch (error) {
      console.error('Buy now error:', error)
      toast({
        title: 'Lỗi',
        description:
          error?.response?.data?.message || 'Không thể mua ngay sản phẩm này',
        variant: 'destructive',
      })

      if (
        error?.response?.data?.message ===
        'Tài khoản của bạn đã bị khóa. Hãy liên hệ với chúng tôi!'
      ) {
        Cookies.remove('jwt')
        localStorage.removeItem('profile')
        navigate({ to: '/sign-in' })
      }
    }
  }

  useEffect(() => {
    const fetchHome = async () => {
      try {
        setLoading(true)
        const response = await getHome()
        console.log(response)
        // Validate the response with Zod schema
        const parsedData = productViewResponseAllSchema.parse(response)

        setNewestProducts(parsedData.newestProducts)
        setBestSellingProducts(parsedData.bestSellingProducts)
      } catch (error) {
        setError(error as Error)
        console.error('Failed to fetch home data:', error)
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
    <section className='container bg-slate-50 py-10'>
      <div className='mb-8 flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>Điện thoại mới nhất</h2>
        <Button variant='outline' asChild>
          <Link to='/dienthoai'>Xem tất cả</Link>
        </Button>
      </div>
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {newestProducts.slice(0, displayLimit).map((product) => (
          <Card
            key={product.idProduct}
            className='group flex h-full flex-col overflow-hidden bg-white transition-shadow hover:shadow-lg'
          >
            <Link to={`/product/${product.idProduct}`} className='flex-1'>
              <CardHeader className='relative aspect-square p-0'>
                {/* Product Image */}
                <div className='flex h-full w-full items-center justify-center p-2 sm:p-4'>
                  <img
                    src={product.image}
                    alt={product.name}
                    className='h-32 w-32 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-48 sm:w-48'
                    loading='lazy'
                  />
                </div>

                {/* Discount Badge */}
                {product.price !== product.priceSeller && (
                  <Badge
                    variant='destructive'
                    className='absolute left-2 top-2 px-1.5 py-0.5 text-[10px] sm:px-2 sm:py-1 sm:text-xs'
                  >
                    Giảm{' '}
                    {Math.round(
                      ((product.price - product.priceSeller) / product.price) *
                        100
                    )}
                    %
                  </Badge>
                )}
              </CardHeader>

              <CardContent className='flex flex-col gap-1.5 p-2 sm:gap-2 sm:p-3'>
                {/* Product Name */}
                <h3 className='line-clamp-2 text-sm font-semibold leading-tight sm:text-base'>
                  {product.name}
                </h3>

                {/* Specs */}
                <div className='flex flex-col gap-1.5 text-xs sm:gap-2 sm:text-sm'>
                  {/* RAM */}
                  <div className='flex flex-wrap items-center gap-1 sm:gap-2'>
                    <span className='font-medium text-gray-500'>Ram:</span>
                    <div className='flex flex-wrap gap-1'>
                      {product.ram.map((ram, i) => (
                        <div
                          key={`ram-${i}`}
                          className='flex h-5 min-w-[32px] items-center justify-center rounded border bg-blue-50 px-1 text-xs font-medium text-blue-700 sm:h-6 sm:min-w-[40px] sm:px-2'
                        >
                          {ram}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ROM */}
                  <div className='flex flex-wrap items-center gap-1 sm:gap-2'>
                    <span className='font-medium text-gray-500'>Rom:</span>
                    <div className='flex flex-wrap gap-1'>
                      {product.rom.map((rom, i) => (
                        <div
                          key={`rom-${i}`}
                          className='flex h-5 min-w-[32px] items-center justify-center rounded border bg-green-50 px-1 text-xs font-medium text-green-700 sm:h-6 sm:min-w-[40px] sm:px-2'
                        >
                          {rom}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className='flex gap-1 sm:gap-1.5'>
                    {product.hex.map((color, i) => (
                      <div
                        key={`color-${i}`}
                        className='h-3 w-3 rounded-full border border-muted shadow-sm sm:h-4 sm:w-4'
                        style={{ backgroundColor: color }}
                        aria-label={`Màu ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Link>

            {/* Price and Actions */}
            <CardFooter className='flex flex-col gap-2 p-2 pt-0 sm:gap-3 sm:p-3'>
              {/* Price */}
              <div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
                <div className='text-base font-bold text-red-600 sm:text-lg'>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(product.priceSeller)}
                </div>
                {product.price !== product.priceSeller && (
                  <div className='text-xs font-medium text-gray-500 line-through sm:text-sm'>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(product.price)}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='flex justify-end gap-1.5 sm:gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  className='h-7 border-gray-300 px-2 text-xs text-gray-700 hover:bg-gray-50 sm:h-8 sm:px-3'
                  onClick={(e) => {
                    e.preventDefault()
                    addToCart(product.idProductDetail)
                  }}
                >
                  Thêm giỏ
                </Button>
                <Button
                  size='sm'
                  className='h-7 bg-gradient-to-r from-blue-500 to-blue-700 px-2 text-xs text-white hover:from-blue-600 hover:to-blue-800 sm:h-8 sm:px-3'
                  onClick={(e) => {
                    e.preventDefault()
                    handleBuyNow(product.idProductDetail)
                  }}
                >
                  Mua ngay
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {bestSellingProducts.length !== 0 && (
        <>
          <div className='mb-8 flex items-center justify-between'>
            <h2 className='pt-8 text-3xl font-bold'>
              Điện thoại bán nhiều nhất
            </h2>
          </div>

          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {bestSellingProducts.slice(0, displayLimit).map((product) => (
              <Card
                key={product.idProduct}
                className='group flex h-full flex-col overflow-hidden bg-white transition-shadow hover:shadow-lg'
              >
                <Link to={`/product/${product.idProduct}`} className='flex-1'>
                  <CardHeader className='relative aspect-square p-0'>
                    {/* Product Image */}
                    <div className='flex h-full w-full items-center justify-center p-2 sm:p-4'>
                      <img
                        src={product.image}
                        alt={product.name}
                        className='h-32 w-32 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-48 sm:w-48'
                        loading='lazy'
                      />
                    </div>

                    {/* Discount Badge */}
                    {product.price !== product.priceSeller && (
                      <Badge
                        variant='destructive'
                        className='absolute left-2 top-2 px-1.5 py-0.5 text-[10px] sm:px-2 sm:py-1 sm:text-xs'
                      >
                        Giảm{' '}
                        {Math.round(
                          ((product.price - product.priceSeller) /
                            product.price) *
                            100
                        )}
                        %
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className='flex flex-col gap-1.5 p-2 sm:gap-2 sm:p-3'>
                    {/* Product Name */}
                    <h3 className='line-clamp-2 text-sm font-semibold leading-tight sm:text-base'>
                      {product.name}
                    </h3>

                    {/* Specs */}
                    <div className='flex flex-col gap-1.5 text-xs sm:gap-2 sm:text-sm'>
                      {/* RAM */}
                      <div className='flex flex-wrap items-center gap-1 sm:gap-2'>
                        <span className='font-medium text-gray-500'>Ram:</span>
                        <div className='flex flex-wrap gap-1'>
                          {product.ram.map((ram, i) => (
                            <div
                              key={`ram-${i}`}
                              className='flex h-5 min-w-[32px] items-center justify-center rounded border bg-blue-50 px-1 text-xs font-medium text-blue-700 sm:h-6 sm:min-w-[40px] sm:px-2'
                            >
                              {ram}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ROM */}
                      <div className='flex flex-wrap items-center gap-1 sm:gap-2'>
                        <span className='font-medium text-gray-500'>Rom:</span>
                        <div className='flex flex-wrap gap-1'>
                          {product.rom.map((rom, i) => (
                            <div
                              key={`rom-${i}`}
                              className='flex h-5 min-w-[32px] items-center justify-center rounded border bg-green-50 px-1 text-xs font-medium text-green-700 sm:h-6 sm:min-w-[40px] sm:px-2'
                            >
                              {rom}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Colors */}
                      <div className='flex gap-1 sm:gap-1.5'>
                        {product.hex.map((color, i) => (
                          <div
                            key={`color-${i}`}
                            className='h-3 w-3 rounded-full border border-muted shadow-sm sm:h-4 sm:w-4'
                            style={{ backgroundColor: color }}
                            aria-label={`Màu ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Link>

                {/* Price and Actions */}
                <CardFooter className='flex flex-col gap-2 p-2 pt-0 sm:gap-3 sm:p-3'>
                  {/* Price */}
                  <div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
                    <div className='text-base font-bold text-red-600 sm:text-lg'>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(product.priceSeller)}
                    </div>
                    {product.price !== product.priceSeller && (
                      <div className='text-xs font-medium text-gray-500 line-through sm:text-sm'>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(product.price)}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className='flex justify-end gap-1.5 sm:gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      className='h-7 border-gray-300 px-2 text-xs text-gray-700 hover:bg-gray-50 sm:h-8 sm:px-3'
                      onClick={(e) => {
                        e.preventDefault()
                        addToCart(product.idProductDetail)
                      }}
                    >
                      Thêm giỏ
                    </Button>
                    <Button
                      size='sm'
                      className='h-7 bg-gradient-to-r from-blue-500 to-blue-700 px-2 text-xs text-white hover:from-blue-600 hover:to-blue-800 sm:h-8 sm:px-3'
                      onClick={(e) => {
                        e.preventDefault()
                        handleBuyNow(product.idProductDetail)
                      }}
                    >
                      Mua ngay
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          {bestSellingProducts.length > displayLimit && (
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
        </>
      )}
    </section>
  )
}
