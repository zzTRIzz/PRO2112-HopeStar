
import { Card, Input, Radio, RadioGroup, Switch } from '@heroui/react'
import { Icon } from '@iconify/react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import React from 'react'
import { LocationSelector } from '../../components/gio-hang/location-selector'
import { OrderSummary } from '../../components/gio-hang/order-summary'
import { ProductList } from '../../components/gio-hang/product-list'
import type { CartItem } from '../../components/gio-hang/types/cart'
import { order } from '../../data/api-cart-service'
import { toast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'

interface CheckoutData {
  customerInfo: {
    name: string
    phone: string
    email: string
  }
  location: {
    deliveryType: string
    province?: string
    district?: string
    commune?: string
  }
  paymentMethod: string
  eInvoice: boolean
}

export function CheckoutPage() {
  const queryClient = useQueryClient()
  const { selectedProducts: productsJson } = useSearch({ strict: false })
  const selectedProducts = React.useMemo(() => {
    try {
      return JSON.parse(productsJson || '[]') as CartItem[]
    } catch (error) {
      console.error('Invalid products data:', error)
      return []
    }
  }, [productsJson])

  // Get profile data once on mount
  const [customerInfo, setCustomerInfo] = React.useState(() => {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}')
    return {
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
    }
  })

  // Initialize checkout data with profile info
  const [checkoutData, setCheckoutData] = React.useState<CheckoutData>({
    customerInfo: {
      name: customerInfo.name,
      phone: customerInfo.phone,
      email: customerInfo.email,
    },
    location: {
      deliveryType: 'delivery',
      province: '',
      district: '',
      commune: '',
    },
    paymentMethod: 'cod',
    eInvoice: false,
  })

  // Add error state
  const [errors, setErrors] = React.useState({
    name: '',
    phone: '',
    email: '',
  })

  // Add validation function
  const validateCustomerInfo = () => {
    const newErrors = {
      name: '',
      phone: '',
      email: '',
    }

    // Name validation
    if (!checkoutData.customerInfo.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên'
    }

    // Phone validation
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/
    if (!checkoutData.customerInfo.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại'
    } else if (!phoneRegex.test(checkoutData.customerInfo.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
    }

    // Email validation (optional)
    if (checkoutData.customerInfo.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(checkoutData.customerInfo.email)) {
        newErrors.email = 'Email không hợp lệ'
      }
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== '')
  }

  const handleLocationSubmit = (locationData: {
    deliveryType: string
    province?: string
    district?: string
    commune?: string
  }) => {
    setCheckoutData((prev) => ({
      ...prev,
      location: locationData,
    }))
  }

  // Update handleCustomerInfoChange
  const handleCustomerInfoChange = (
    field: keyof CheckoutData['customerInfo'],
    value: string
  ) => {
    setCheckoutData((prev) => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        [field]: value,
      },
    }))
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user types
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }))
  }

  const [formErrors, setFormErrors] = React.useState({
    customerInfo: {},
    location: {},
  })

  // Add form validity state
  const [isFormValid, setIsFormValid] = React.useState(false)

  // Update validateForm to set the validity state
  const validateForm = React.useCallback(() => {
    const errors = {
      customerInfo: {
        name: '',
        phone: '',
        email: '',
      },
      location: {
        province: '',
        district: '',
        commune: '',
      },
    }

    // Validate customer info
    if (!checkoutData.customerInfo.name.trim()) {
      errors.customerInfo.name = 'Vui lòng nhập họ tên người đặt'
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/
    if (!checkoutData.customerInfo.phone.trim()) {
      errors.customerInfo.phone = 'Vui lòng nhập số điện thoại'
    } else if (!phoneRegex.test(checkoutData.customerInfo.phone)) {
      errors.customerInfo.phone = 'Số điện thoại không hợp lệ'
    }

    if (
      checkoutData.customerInfo.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutData.customerInfo.email)
    ) {
      errors.customerInfo.email = 'Email không hợp lệ'
    }

    // Check if using saved address from profile
    const profile = JSON.parse(localStorage.getItem('profile') || '{}')
    const hasSavedAddress = !!profile.address

    // Skip location validation if has saved address
    if (!hasSavedAddress && checkoutData.location.deliveryType === 'delivery') {
      if (!checkoutData.location.province) {
        errors.location.province = 'Vui lòng chọn tỉnh/thành phố'
      }
      if (!checkoutData.location.district) {
        errors.location.district = 'Vui lòng chọn quận/huyện'
      }
      if (!checkoutData.location.commune) {
        errors.location.commune = 'Vui lòng chọn phường/xã'
      }
    }

    setFormErrors(errors)
    const valid =
      !Object.values(errors.customerInfo).some((error) => error !== '') &&
      (!Object.values(errors.location).some((error) => error !== '') ||
        hasSavedAddress)
    setIsFormValid(valid)
    return valid
  }, [checkoutData])

  // Add effect to validate form when data changes
  React.useEffect(() => {
    validateForm()
  }, [validateForm, checkoutData])

  const navigate = useNavigate()

  const handleCheckout = async () => {
    if (!validateForm()) {
      return
    }

    try {
      // Get saved address from profile if exists
      const profile = JSON.parse(localStorage.getItem('profile') || '{}')
      const hasSavedAddress = !!profile.address

      // Prepare order data
      const orderData = {
        customerInfo: checkoutData.customerInfo,
        location: {
          deliveryType: checkoutData.location.deliveryType,
          fullAddress: hasSavedAddress ? profile.address : checkoutData.location.fullAddress,
        },
        paymentMethod: checkoutData.paymentMethod,
        eInvoice: checkoutData.eInvoice,
        products: selectedProducts,
      }

      // Call API to create order
      await order(orderData)

      // Show success message
      toast({
        title: 'Đặt hàng thành công',
        description: 'Đơn hàng của bạn đã được tạo thành công',
      })
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
      // Navigate to orders page
      navigate({ to: '/taikhoan/don-hang-cua-toi' })

    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: 'Đặt hàng thất bại',
        description:
          error?.response?.data?.message ||
          'Không thể thêm sản phẩm vào giỏ hàng',
        variant: 'destructive',
      })
    }
  }

  // Update isLoggedIn check to also verify if data exists
  const { hasAllInfo, isLoggedIn } = React.useMemo(() => {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}')
    return {
      isLoggedIn: !!profile.id,
      hasAllInfo: !!(profile.name && profile.phone && profile.email),
    }
  }, [])

  return (
    <div className='min-h-screen bg-[#F7F7F7] p-4 md:p-6'>
      <div className='mx-auto max-w-7xl'>
        <Link
          to='/gio-hang'
          className='mb-6 inline-flex items-center gap-2 text-primary-500'
        >
          <Icon icon='lucide:arrow-left' className='h-5 w-5' />
          <span>Quay lại giỏ hàng</span>
        </Link>

        <div className='grid gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <Card>
              <div className='p-6'>
                <h2 className='mb-4 text-xl font-bold'>
                  Sản phẩm đã chọn ({selectedProducts.length})
                </h2>
                <ProductList products={selectedProducts} />
              </div>
            </Card>

            {/* xu ly thong tin khach hang */}

            <Card>
              <div className='p-6'>
                <h2 className='mb-4 text-xl font-bold'>Người đặt hàng</h2>
                <div className='grid gap-4'>
                  <Input
                    label='Họ và tên'
                    placeholder='Nhập họ và tên'
                    variant='bordered'
                    value={customerInfo.name}
                    onChange={(e) =>
                      handleCustomerInfoChange('name', e.target.value)
                    }
                    isRequired
                    errorMessage={errors.name}
                    isInvalid={!!errors.name}
                    isDisabled={isLoggedIn} // Disable if logged in
                  />
                  <Input
                    label='Số điện thoại'
                    placeholder='Nhập số điện thoại'
                    variant='bordered'
                    value={customerInfo.phone}
                    onChange={(e) =>
                      handleCustomerInfoChange('phone', e.target.value)
                    }
                    isRequired
                    errorMessage={errors.phone}
                    isInvalid={!!errors.phone}
                    description={
                      isLoggedIn
                        ? customerInfo.phone
                          ? ''
                          : 'Vui lòng cập nhật số điện thoại'
                        : ''
                    }
                  />
                  <Input
                    label='Email (Không bắt buộc)'
                    placeholder='Nhập email'
                    variant='bordered'
                    value={customerInfo.email}
                    onChange={(e) =>
                      handleCustomerInfoChange('email', e.target.value)
                    }
                    errorMessage={errors.email}
                    isInvalid={!!errors.email}
                    isDisabled={isLoggedIn}
                  />
                  {isLoggedIn && (
                    <p className='mt-2 text-sm text-gray-500'>
                      * Để thay đổi thông tin, vui lòng cập nhật trong trang
                      Thông tin tài khoản
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* xu ly dia chi */}
            <LocationSelector onSubmit={handleLocationSubmit} />

            <Card>
              <div className='p-6'>
                <h2 className='mb-4 text-xl font-bold'>
                  Phương thức thanh toán
                </h2>
                <RadioGroup
                  value={checkoutData.paymentMethod}
                  onValueChange={(value) =>
                    setCheckoutData((prev) => ({
                      ...prev,
                      paymentMethod: value,
                    }))
                  }
                >
                  <div className='flex flex-col gap-4'>
                    <Radio value='cod'>
                      <div className='flex items-center gap-2'>
                        <Icon icon='lucide:credit-card' className='h-8 w-8' />
                        <div>
                          <p className='font-medium'>
                            Thanh toán khi nhận hàng
                          </p>
                          {/* <p className="text-sm text-gray-500">
                            (COD - Cash On Delivery)
                          </p> */}
                        </div>
                      </div>
                    </Radio>
                    <Radio value='qr'>
                      <div className='flex items-center gap-2'>
                        <Icon icon='lucide:qr-code' className='h-8 w-8' />
                        <div>
                          <p className='font-medium'>Thanh toán bằng VNPAY</p>
                          {/* <p className="text-sm text-gray-500">
                            (Thẻ ATM nội địa/Ví điện tử)
                          </p> */}
                        </div>
                      </div>
                    </Radio>
                  </div>
                </RadioGroup>

                <div className='mt-6 flex items-center justify-between'>
                  <div>
                    <p className='font-medium'>Xuất hóa đơn điện tử</p>
                    {/* <p className="text-sm text-gray-500">
                      Hóa đơn sẽ được gửi qua email của bạn
                    </p> */}
                  </div>
                  <Switch
                    isSelected={checkoutData.eInvoice}
                    onValueChange={(value) =>
                      setCheckoutData((prev) => ({ ...prev, eInvoice: value }))
                    }
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className='lg:col-span-1'>
            <OrderSummary
              onCheckout={handleCheckout}
              products={selectedProducts}
              isValid={isFormValid}
              errors={formErrors}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
