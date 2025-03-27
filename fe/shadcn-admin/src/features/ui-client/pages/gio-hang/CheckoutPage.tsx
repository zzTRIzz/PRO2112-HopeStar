import React from 'react'
import { Link, useSearch } from '@tanstack/react-router'
import { Card, Input, RadioGroup, Radio, Button, Switch } from '@heroui/react'
import { Icon } from '@iconify/react'
import { LocationSelector } from '../../components/gio-hang/location-selector'
import { OrderSummary } from '../../components/gio-hang/order-summary'
import { ProductList } from '../../components/gio-hang/product-list'
import type { CartItem } from '../../components/gio-hang/types/cart'

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
  const { selectedProducts: productsJson } = useSearch({ strict: false })
  const selectedProducts = React.useMemo(() => {
    try {
      return JSON.parse(productsJson || '[]') as CartItem[]
    } catch (error) {
      console.error('Invalid products data:', error)
      return []
    }
  }, [productsJson])

  const [checkoutData, setCheckoutData] = React.useState<CheckoutData>({
    customerInfo: {
      name: '',
      phone: '',
      email: '',
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
  }

  const handleCheckout = () => {
    console.log('Checkout data:', {
      ...checkoutData,
      products: selectedProducts,
    })
    // Xử lý thanh toán tại đây
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/gio-hang"
          className="mb-6 inline-flex items-center gap-2 text-primary-500"
        >
          <Icon icon="lucide:arrow-left" className="h-5 w-5" />
          <span>Quay lại giỏ hàng</span>
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <div className="p-6">
                <h2 className="mb-4 text-xl font-bold">
                  Sản phẩm đã chọn ({selectedProducts.length})
                </h2>
                <ProductList products={selectedProducts} />
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h2 className="mb-4 text-xl font-bold">Người đặt hàng</h2>
                <div className="grid gap-4">
                  <Input
                    label="Họ và tên"
                    placeholder="Nhập họ và tên"
                    variant="bordered"
                    value={checkoutData.customerInfo.name}
                    onChange={(e) =>
                      handleCustomerInfoChange('name', e.target.value)
                    }
                  />
                  <Input
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
                    variant="bordered"
                    value={checkoutData.customerInfo.phone}
                    onChange={(e) =>
                      handleCustomerInfoChange('phone', e.target.value)
                    }
                  />
                  <Input
                    label="Email (Không bắt buộc)"
                    placeholder="Nhập email"
                    variant="bordered"
                    value={checkoutData.customerInfo.email}
                    onChange={(e) =>
                      handleCustomerInfoChange('email', e.target.value)
                    }
                  />
                </div>
              </div>
            </Card>

            <LocationSelector onSubmit={handleLocationSubmit} />

            <Card>
              <div className="p-6">
                <h2 className="mb-4 text-xl font-bold">
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
                  <div className="flex flex-col gap-4">
                    <Radio value="cod">
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:credit-card" className="h-8 w-8" />
                        <div>
                          <p className="font-medium">
                            Thanh toán khi nhận hàng
                          </p>
                          {/* <p className="text-sm text-gray-500">
                            (COD - Cash On Delivery)
                          </p> */}
                        </div>
                      </div>
                    </Radio>
                    <Radio value="qr">
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:qr-code" className="h-8 w-8" />
                        <div>
                          <p className="font-medium">
                            Thanh toán bằng VNPAY
                          </p>
                          {/* <p className="text-sm text-gray-500">
                            (Thẻ ATM nội địa/Ví điện tử)
                          </p> */}
                        </div>
                      </div>
                    </Radio>
                  </div>
                </RadioGroup>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Xuất hóa đơn điện tử</p>
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

          <div className="lg:col-span-1">
            <OrderSummary
              onCheckout={handleCheckout}
              products={selectedProducts}
            />
          </div>
        </div>
      </div>
    </div>
  )
}