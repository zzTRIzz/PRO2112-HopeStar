import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
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
import { RelatedProducts } from '../components/related-products'
import { addProductToCart } from '../data/api-cart-service'
import { getProductDetail } from '../data/api-service'
import { productDetailViewResponse } from '../data/schema'
import ProductReviews, { RatingData } from '../components/product-reviews'
import Cookies from 'js-cookie'
// import ProductReviews from '../components/product-reviews'
import Footer from '@/components/layout/footer'

export default function ProductDetail() {
  const { id } = Route.useParams()
  const [productDetail, setProductDetail] =
    useState<productDetailViewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedStorage, setSelectedStorage] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [currentProductDetail, setCurrentProductDetail] = useState<any>(null)
  const SpecItem = ({
    icon,
    label,
    value,
    highlight = false,
  }: {
    icon: string
    label: string
    value: string
    highlight?: boolean
  }) => (
    <div
      className={`flex items-start gap-3 rounded-lg p-3 transition-all ${highlight ? 'border border-primary-100 bg-primary-50' : 'hover:bg-gray-50'}`}
    >
      <div
        className={`rounded-md p-2 ${highlight ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}`}
      >
        <Icon icon={icon} className='h-4 w-4' />
      </div>
      <div className='flex-1'>
        <p className='text-sm text-gray-500'>{label}</p>
        <p
          className={`mt-1 font-medium ${highlight ? 'text-primary-600' : 'text-gray-800'}`}
        >
          {value}
        </p>
      </div>
    </div>
  )
  // add cart

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Lưu ý: Đặt tiêu đề trang trong useEffect để tránh lỗi SSR
  useEffect(() => {
    if (productDetail?.productName) {
      document.title = `${productDetail.productName} | HopeStar`
    } else {
      document.title = 'HopeStar'
    }
    return () => {
      document.title = 'HopeStar'
    }
  }, [productDetail?.productName])

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
      if (error?.response?.data?.message ==="Tài khoản của bạn đã bị khóa. Hãy liên hệ với chúng tôi!" ) {
        Cookies.remove('jwt')
        localStorage.removeItem('profile')
        navigate({ to: '/sign-in' })
      }
    }
  }
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
      const data = await addProductToCart(idProductDetail, quantity)
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
      const cartItems = data?.cartDetailResponseList || []

      console.log('Buy now data:', cartItems)
      const addedProduct = cartItems[0]

      if (!addedProduct) {
        throw new Error('Không thể thêm sản phẩm vào giỏ hàng')
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

      if (error?.response?.data?.message ==="Tài khoản của bạn đã bị khóa. Hãy liên hệ với chúng tôi!" ) {
        Cookies.remove('jwt')
        localStorage.removeItem('profile')
        navigate({ to: '/sign-in' })
      }

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

  // Lấy danh sách màu có sẵn cho cặp RAM-ROM đã chọn
  const availableColorsForSelection = useMemo(() => {
    if (!productDetail?.availableColors || !selectedStorage) {
      return []
    }
    return productDetail.availableColors[selectedStorage] || []
  }, [productDetail?.availableColors, selectedStorage])

  // Reset selectedColor khi đổi RAM-ROM nếu màu hiện tại không có sẵn
  useEffect(() => {
    if (
      availableColorsForSelection.length > 0 &&
      !availableColorsForSelection.some((c) => c.colorCode === selectedColor)
    ) {
      setSelectedColor(availableColorsForSelection[0].colorCode)
    }
  }, [availableColorsForSelection, selectedColor])

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



  const [reviewData, setReviewData] = useState<RatingData>({
    reviews: [],
    ratingSummaryResponse: null,
    hasPurchased: false,
    evaluate: 0,
    numberSold: 0,
    product: ''
  });

  const getAllReviews = async () => {
    try {
      const jwt = Cookies.get('jwt');
      console.log('jwt', jwt)
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
      }

      const response = await fetch(`http://localhost:8080/api/product-reviews/${currentProductDetail?.productDetailId}`, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`Lỗi server: ${response.status}`);
      }


      const data = await response.json();
      if (data && data.data) {
        setReviewData(data.data);
        console.log('Dữ liệu đánh giá:', data.data);
      } else {
        console.warn('Không có dữ liệu đánh giá.');
        // setReviewData({
        //   reviews: [],
        //   ratingSummaryResponse: null,
        //   hasPurchased: false,
        //   evaluate: 0,
        //   numberSold: 0
        // });
      }
    } catch (error) {
      console.error('Lỗi khi tải đánh giá:', error);
    }
  };

  const ratingStats = reviewData.ratingSummaryResponse || {
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
    total: 0,
  };

  const averageRating =
    (5 * ratingStats.fiveStar +
      4 * ratingStats.fourStar +
      3 * ratingStats.threeStar +
      2 * ratingStats.twoStar +
      1 * ratingStats.oneStar) /
    (ratingStats.total || 1);

  useEffect(() => {
    if (currentProductDetail?.productDetailId) {
      getAllReviews();
    }
  }, [currentProductDetail?.productDetailId]);


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
    attribute,
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
              currentProductDetail?.imageUrl || defaultProductDetail?.imageUrl
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
                  <span className='text-warning'> {averageRating.toFixed(1)}</span>
                  <div className='flex items-center'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon
                        key={i}
                        icon="lucide:star"
                        className={
                          i < Math.floor(averageRating)
                            ? 'text-warning'
                            : 'text-default-300'
                        }
                      />
                    ))}
                  </div>
                  <span className='text-default-500'>( {ratingStats.total} đánh giá)</span>
                </div>
                <span className='text-default-500'>|</span>
                <span className='text-success'>Đã bán {reviewData.numberSold}</span>
              </div>
              <div className='mt-4 flex items-center gap-2'>
                <span className='text-3xl font-bold text-red-600'>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(
                    currentProductDetail?.priceSell ||
                    defaultProductDetail?.priceSell
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
                          defaultProductDetail?.price
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
                {availableColorsForSelection.map((color) => (
                  <div
                    key={color.id}
                    className={`flex cursor-pointer flex-col items-center gap-2 ${selectedColor === color.colorCode
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
                    defaultProductDetail?.inventoryQuantity}{' '}
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
              <Button
                color='success'
                size='lg'
                className='flex-1'
                onClick={() => {
                  // e.preventDefault()
                  handleBuyNow(currentProductDetail?.productDetailId)
                }}
              >
                Mua ngay
              </Button>
            </div>

            {/* Additional Info */}
            {/* <Card>
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
            </Card> */}
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
                  <Icon
                    icon='lucide:settings'
                    className='h-5 w-5 text-primary-600'
                  />
                  <span className='font-medium'>Thông số kỹ thuật</span>
                </div>
              }
            >
              <Card className='overflow-hidden rounded-xl border border-gray-100 shadow-sm'>
                <CardBody className='p-6'>
                  {/* --- Row 1: Màn hình & Camera + Hiệu năng & Pin --- */}
                  <div className='mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2'>
                    {/* Phần 1 - Màn hình & Camera */}
                    <div className='space-y-4'>
                      <div className='flex items-center gap-3'>
                        <div className='rounded-lg bg-primary-50 p-2.5 text-primary-600'>
                          <Icon icon='lucide:monitor' className='h-5 w-5' />
                        </div>
                        <h3 className='text-lg font-semibold text-gray-800'>
                          Màn hình & Camera
                        </h3>
                      </div>

                      <div className='grid grid-cols-2 gap-3'>
                        <SpecItem
                          icon='lucide:smartphone'
                          label='Màn hình'
                          value={attribute.screen}
                          highlight
                        />
                        <SpecItem
                          icon='lucide:maximize-2'
                          label='Độ phân giải'
                          value={attribute.resolution}
                          highlight
                        />
                        <SpecItem
                          icon='lucide:camera'
                          label='Camera trước'
                          value={attribute.frontCamera}
                          highlight
                        />
                        <SpecItem
                          icon='lucide:aperture'
                          label='Camera sau'
                          value={attribute.rearCamera}
                          highlight
                        />
                      </div>
                    </div>

                    {/* Phần 2 - Hiệu năng & Pin */}
                    <div className='space-y-4'>
                      <div className='flex items-center gap-3'>
                        <div className='rounded-lg bg-blue-50 p-2.5 text-blue-600'>
                          <Icon icon='lucide:zap' className='h-5 w-5' />
                        </div>
                        <h3 className='text-lg font-semibold text-gray-800'>
                          Hiệu năng & Pin
                        </h3>
                      </div>

                      <div className='grid grid-cols-2 gap-3'>
                        <SpecItem
                          icon='lucide:cpu'
                          label='Chip'
                          value={attribute.chip}
                          highlight
                        />
                        <SpecItem
                          icon='lucide:smartphone'
                          label='Hệ điều hành'
                          value={attribute.os}
                          highlight
                        />
                        <SpecItem
                          icon='lucide:battery-charging'
                          label='Pin'
                          value={attribute.battery}
                          highlight
                        />
                        <SpecItem
                          icon='lucide:plug'
                          label='Cổng sạc'
                          value={attribute.charger}
                          highlight
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- Row 2: Thông tin khác (Full width) --- */}
                  <div>
                    <div className='mb-4 flex items-center gap-3'>
                      <div className='rounded-lg bg-purple-50 p-2.5 text-purple-600'>
                        <Icon icon='lucide:settings-2' className='h-5 w-5' />
                      </div>
                      <h3 className='text-lg font-semibold text-gray-800'>
                        Thông tin khác
                      </h3>
                    </div>

                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                      <SpecItem
                        icon='lucide:wifi'
                        label='Wi-Fi'
                        value={attribute.wifi}
                        highlight
                      />
                      <SpecItem
                        icon='lucide:bluetooth'
                        label='Bluetooth'
                        value={attribute.bluetooth}
                        highlight
                      />
                      <SpecItem
                        icon='lucide:nfc'
                        label='NFC'
                        value={attribute.nfc}
                        highlight
                      />
                      <SpecItem
                        icon='lucide:sim-card'
                        label='SIM'
                        value={attribute.sim}
                        highlight
                      />
                      <SpecItem
                        icon='lucide:weight'
                        label='Trọng lượng'
                        value={`${attribute.weight}g`}
                        highlight
                      />
                      <SpecItem
                        icon='lucide:tag'
                        label='Thương hiệu'
                        value={attribute.brand}
                        highlight
                      />
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
              <ProductReviews productDetail={productDetail}
                currentProductDetail={currentProductDetail} 
                averageRating={averageRating}
                getAllReviews={getAllReviews}
                reviewData={reviewData}
                ratingStats={ratingStats}
                />
            </Tab>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className='mt-6'>
          <RelatedProducts />
        </div>
      </div>
      <Footer />
    </>
  )
}
