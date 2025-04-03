import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Route } from '@/routes/(auth)/product.$id'
import {
  Badge,
  Button,
  Card,
  CardBody,
  Divider,
  Spinner,
  Tab,
  Tabs,
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { toast } from '@/hooks/use-toast'
import Navbar from '../components/navbar'
import { ProductGallery } from '../components/product-gallery'
import { ProductReviews } from '../components/product-reviews'
import { RelatedProducts } from '../components/related-products'
import { addProductToCart } from '../data/api-cart-service'
import { getProductDetail } from '../data/api-service'
import { productDetailViewResponse } from '../data/schema'

export default function ProductDetail() {
  const { id } = Route.useParams() // Lấy id từ URL
  const [productDetail, setProductDetail] =
    useState<productDetailViewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedStorage, setSelectedStorage] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [currentProductDetail, setCurrentProductDetail] = useState<any>(null)

  // add cart

  const queryClient = useQueryClient()

  const addToCart = async (productDetailId: number | undefined) => {
    try {
      if (!productDetailId) {
        toast({
          title: 'Lỗi',
          description: 'Vui lòng chọn phiên bản sản phẩm',
          variant: 'destructive',
        })
        return
      }

      await addProductToCart(productDetailId, quantity)

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
    }
  }

  // Lấy dữ liệu sản phẩm chi tiết từ API
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const data = await getProductDetail(Number(id))
        setProductDetail(data)
        if (data.defaultProductDetail) {
          const { ramId, romId } = data.defaultProductDetail.ramRomOption
          setSelectedStorage(`${ramId}-${romId}`) // Set giá trị mặc định
          setSelectedColor(data.defaultProductDetail.colorOption.colorCode)
          setCurrentProductDetail(data.defaultProductDetail)
        }
      } catch (error) {
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetail()
  }, [id])

  // Hàm tìm sản phẩm chi tiết dựa trên RAM/ROM và màu sắc
  const findProductDetail = (ramRomKey: string, colorCode: string) => {
    const colorOption = productDetail?.colorOptions.find(
      (color) => color.colorCode === colorCode
    )
    if (!colorOption) return null

    const detailKey = `${ramRomKey}-${colorOption.id}`
    return productDetail?.productDetails[detailKey] || null
  }

  // Cập nhật sản phẩm chi tiết khi RAM/ROM hoặc màu sắc thay đổi
  useEffect(() => {
    if (selectedStorage && selectedColor && productDetail) {
      const detail = findProductDetail(selectedStorage, selectedColor)
      if (detail) {
        setCurrentProductDetail(detail)
      } else {
        setCurrentProductDetail(productDetail.defaultProductDetail)
      }
    }
  }, [selectedStorage, selectedColor, productDetail])

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Spinner size='lg' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='mt-9 flex h-screen items-center justify-center text-2xl'>
        Lỗi: {error.message}
      </div>
    )
  }

  if (!productDetail) {
    return <div>Không tìm thấy sản phẩm</div>
  }

  const {
    productName,
    productDescription,
    defaultProductDetail,
    ramRomOptions,
    colorOptions,
    imageUrls,
  } = productDetail

  return (
    <>
      <Navbar />
      <div className='container mx-auto px-4 py-8'>
        {/* Breadcrumb */}
        <nav className='mb-6 flex items-center gap-2 text-sm text-gray-600'>
          <Link to='/' className='flex items-center gap-1 hover:text-blue-500'>
            <Icon icon='lucide:home' className='h-4 w-4' />
            Trang chủ
          </Link>
          <Icon icon='lucide:chevron-right' className='h-4 w-4 text-gray-400' />
          <Link to='/dienthoai' className='hover:text-blue-500'>
            Điện thoại
          </Link>
          <Icon icon='lucide:chevron-right' className='h-4 w-4 text-gray-400' />
          <span className='font-semibold text-gray-800'>{productName}</span>
        </nav>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          {/* Product Images */}
          <ProductGallery
            defaultImage={
              currentProductDetail?.imageUrl || defaultProductDetail.imageUrl
            }
            imageUrls={imageUrls}
          />

          {/* Product Info */}
          <div className='space-y-6'>
            <div>
              <div className='flex items-center gap-2'>
                <h1 className='text-2xl font-bold'>{productName}</h1>
                <Badge color='success'>Mới</Badge>
              </div>
              <div className='mt-2 flex items-center gap-2'>
                <div className='flex items-center gap-1'>
                  <span className='text-warning'>4.8</span>
                  <div className='flex items-center'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon
                        key={i}
                        icon='lucide:star'
                        className={i < 4 ? 'text-warning' : 'text-default-300'}
                      />
                    ))}
                  </div>
                  <span className='text-default-500'>(1 đánh giá)</span>
                </div>
                <span className='text-default-500'>|</span>
                <span className='text-success'>Đã bán 1.2k+</span>
              </div>
              <div className='mt-4 flex items-center gap-2'>
                <span className='text-3xl font-bold text-red-600'>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(
                    currentProductDetail?.priceSell ||
                      defaultProductDetail.priceSell
                  )}
                </span>
                {currentProductDetail?.price !==
                  currentProductDetail?.priceSell && (
                  <>
                    <span className='text-lg text-gray-500 line-through'>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(
                        currentProductDetail?.price ||
                          defaultProductDetail.price
                      )}
                    </span>
                    <Badge color='danger' className='ml-2'>
                      {(
                        ((currentProductDetail?.price -
                          currentProductDetail?.priceSell) /
                          currentProductDetail?.price) *
                        100
                      ).toFixed(0)}
                      % giảm
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <Divider />

            {/* Storage Selection */}
            <div className='space-y-3'>
              <h3 className='text-lg font-semibold'>Dung lượng</h3>
              <div className='flex flex-wrap gap-2'>
                {ramRomOptions.map((ramRom) => {
                  const ramRomKey = `${ramRom.ramId}-${ramRom.romId}`
                  return (
                    <Button
                      key={ramRomKey}
                      variant={
                        selectedStorage === ramRomKey ? 'solid' : 'bordered'
                      }
                      color={
                        selectedStorage === ramRomKey ? 'primary' : 'default'
                      }
                      onClick={() => setSelectedStorage(ramRomKey)}
                    >
                      {ramRom.ramSize} - {ramRom.romSize}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Color Selection */}
            <div className='space-y-3'>
              <h3 className='text-lg font-semibold'>Màu sắc</h3>
              <div className='flex gap-3'>
                {colorOptions.map((color) => (
                  <div
                    key={color.id}
                    className={`flex cursor-pointer flex-col items-center gap-2 ${
                      selectedColor === color.colorCode
                        ? 'rounded-lg p-1 ring-2 ring-blue-500'
                        : ''
                    }`}
                    onClick={() => setSelectedColor(color.colorCode)}
                  >
                    <div
                      className='h-10 w-10 rounded-full border border-gray-300'
                      style={{ backgroundColor: color.colorCode }}
                    />
                    <span className='text-sm text-gray-700'>
                      {color.colorName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className='space-y-3'>
              <h3 className='text-lg font-semibold'>Số lượng</h3>
              <div className='flex items-center gap-3'>
                <Button
                  isIconOnly
                  variant='bordered'
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Icon icon='lucide:minus' />
                </Button>
                <span className='w-12 text-center text-lg font-medium'>
                  {quantity}
                </span>
                <Button
                  isIconOnly
                  variant='bordered'
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 5}
                >
                  <Icon icon='lucide:plus' />
                </Button>
                <span className='text-sm text-gray-500'>
                  Còn{' '}
                  {currentProductDetail?.inventoryQuantity ||
                    defaultProductDetail.inventoryQuantity}{' '}
                  sản phẩm
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4 pt-4'>
              <Button
                color='primary'
                size='lg'
                className='flex-1'
                startContent={<Icon icon='lucide:shopping-cart' />}
                onClick={() => addToCart(currentProductDetail?.productDetailId)}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button color='success' size='lg' className='flex-1'>
                Mua ngay
              </Button>
            </div>

            {/* Additional Info */}
            <Card>
              <CardBody className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <Icon
                    icon='lucide:shield-check'
                    className='h-6 w-6 text-green-500'
                  />
                  <div>
                    <h4 className='font-semibold'>Hàng chính hãng</h4>
                    <p className='text-sm text-gray-500'>
                      12 tháng tại trung tâm bảo hành chính hãng
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Icon
                    icon='lucide:repeat'
                    className='h-6 w-6 text-blue-500'
                  />
                  <div>
                    <h4 className='font-semibold'>Đổi trả miễn phí</h4>
                    <p className='text-sm text-gray-500'>
                      30 ngày đổi trả miễn phí
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className='mt-12'>
          <Tabs aria-label='Product details' size='lg' variant='underlined'>
            <Tab
              key='description'
              title={
                <div className='flex items-center gap-2'>
                  <Icon icon='lucide:file-text' className='h-5 w-5' />
                  <span>Mô tả</span>
                </div>
              }
            >
              <Card>
                <CardBody>
                  <div className='prose max-w-none'>
                    <p>{productDescription}</p>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab
              key='specs'
              title={
                <div className='flex items-center gap-2'>
                  <Icon icon='lucide:settings' className='h-5 w-5' />
                  <span>Thông số kỹ thuật</span>
                </div>
              }
            >
              <Card>
                <CardBody>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div className='space-y-4'>
                      <div className='flex justify-between border-b py-2'>
                        <span className='text-gray-500'>Màn hình</span>
                        <span>6.7 inch OLED</span>
                      </div>
                      <div className='flex justify-between border-b py-2'>
                        <span className='text-gray-500'>Chip</span>
                        <span>A17 Pro</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab
              key='reviews'
              title={
                <div className='flex items-center gap-2'>
                  <Icon icon='lucide:star' className='h-5 w-5' />
                  <span>Đánh giá</span>
                </div>
              }
            >
              <ProductReviews />
            </Tab>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className='mt-12'>
          <h2 className='mb-6 text-2xl font-bold'>Sản phẩm tương tự</h2>
          <RelatedProducts />
        </div>
      </div>
    </>
  )
}
