import { useEffect, useRef, useState } from 'react'
import { Button, Card, Input, Select, SelectItem } from '@heroui/react'
import Ship from './ship'
import type { CartItem, Voucher } from './types/cart'

// Mock vouchers data (trong thực tế sẽ lấy từ API)
const MOCK_VOUCHERS: Voucher[] = [
  {
    id: '1',
    code: 'SUMMER50K',
    value: 50000,
    type: 'fixed',
    description: 'Giảm 50.000đ cho đơn hàng từ 500.000đ',
    minOrderValue: 500000,
  },
  {
    id: '2',
    code: 'SALE10',
    value: 10,
    type: 'percentage',
    description: 'Giảm 10% tổng giá trị đơn hàng',
  },
  {
    id: '3',
    code: 'NEWUSER100K',
    value: 100000,
    type: 'fixed',
    description: 'Giảm 100.000đ cho đơn hàng từ 1.000.000đ',
    minOrderValue: 1000000,
  },
]

interface OrderSummaryProps {
  onCheckout: () => void
  products: CartItem[]
  isValid: boolean
  confirmedAddress?: string
  errors: {
    customerInfo: Record<string, string>
    location: Record<string, string>
  }
  onValuesChange?: (data: {
    subtotal: number
    shippingFee: number
    insuranceFee: number
    voucherDiscount: number
    total: number
    selectedVoucher: Voucher | null
  }) => void
}

export function OrderSummary({
  onCheckout,
  products,
  isValid,
  confirmedAddress, // Nhận prop
  errors,
  onValuesChange,
}: OrderSummaryProps) {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherError, setVoucherError] = useState('')
  const [shippingFee, setShippingFee] = useState(0)
  const [insuranceFee, setInsuranceFee] = useState(0)

  const subtotal = products.reduce(
    (sum, item) => sum + item.priceSell * item.quantity,
    0
  )

  // Chọn voucher có giá trị cao nhất mặc định
  useEffect(() => {
    if (!selectedVoucher && subtotal > 0) {
      const availableVouchers = MOCK_VOUCHERS.filter(
        (v) => !v.minOrderValue || subtotal >= v.minOrderValue
      )

      if (availableVouchers.length > 0) {
        const highestValueVoucher = availableVouchers.reduce(
          (highest, current) => {
            const highestValue =
              highest.type === 'fixed'
                ? highest.value
                : Math.round(subtotal * (highest.value / 100))

            const currentValue =
              current.type === 'fixed'
                ? current.value
                : Math.round(subtotal * (current.value / 100))

            return currentValue > highestValue ? current : highest
          },
          availableVouchers[0]
        )

        setSelectedVoucher(highestValueVoucher)
      }
    }
  }, [subtotal])

  // Tính toán giảm giá voucher
  const calculateVoucherDiscount = (
    voucher: Voucher | null,
    subtotal: number
  ): number => {
    if (!voucher) return 0
    if (voucher.minOrderValue && subtotal < voucher.minOrderValue) return 0

    return voucher.type === 'fixed'
      ? voucher.value
      : Math.round(subtotal * (voucher.value / 100))
  }

  const voucherDiscount = calculateVoucherDiscount(selectedVoucher, subtotal)
  const total = subtotal - voucherDiscount + shippingFee + insuranceFee

  const handleShippingFeeChange = (shipping: number, insurance: number) => {
    setShippingFee(shipping)
    setInsuranceFee(insurance)
  }

  const renderErrors = () => {
    const errorMessages = []
    const profile = JSON.parse(localStorage.getItem('profile') || '{}')
    const hasSavedAddress = !!profile.address

    // Always show customer info errors
    Object.values(errors.customerInfo).forEach((error) => {
      if (error) errorMessages.push(error)
    })

    // Only show location errors if:
    // 1. No saved address exists OR
    // 2. User is changing address (check from localStorage)
    const isChangingAddress =
      localStorage.getItem('isChangingAddress') === 'true'

    if (!hasSavedAddress || isChangingAddress) {
      Object.values(errors.location).forEach((error) => {
        if (error) errorMessages.push(error)
      })
    }

    if (errorMessages.length === 0) return null

    return (
      <div className='mb-4 mt-2 rounded-lg border border-red-200 bg-red-50 p-3'>
        <p className='mb-2 text-sm font-medium text-red-600'>
          Vui lòng kiểm tra lại thông tin:
        </p>
        <ul className='list-disc space-y-1 pl-4'>
          {errorMessages.map((message, index) => (
            <li key={index} className='text-sm text-red-600'>
              {message}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // Thêm ref để lưu giá trị trước đó
  const previousValues = useRef({
    subtotal: 0,
    shippingFee: 0,
    insuranceFee: 0,
    voucherDiscount: 0,
    total: 0,
    selectedVoucher: null,
  })

  // Callback khi các giá trị thay đổi
  useEffect(() => {
    const values = {
      subtotal,
      shippingFee,
      insuranceFee,
      voucherDiscount,
      total,
      selectedVoucher,
    }

    // So sánh với giá trị trước đó để tránh update không cần thiết
    if (JSON.stringify(values) !== JSON.stringify(previousValues.current)) {
      previousValues.current = values
      onValuesChange?.(values)
    }
  }, [
    subtotal,
    shippingFee,
    insuranceFee,
    voucherDiscount,
    total,
    selectedVoucher,
  ])

  return (
    <div className='order-summary-wrapper'>
      <Card className='relative overflow-hidden'>
        <div className='p-6'>
          <h2 className='mb-4 text-xl font-bold'>Thông tin đơn hàng</h2>

          {/* Phần chọn voucher */}
          <div className='mb-4 space-y-3'>
            <Select
              label='Chọn voucher'
              placeholder='Chọn voucher'
              value={selectedVoucher?.id || ''}
              classNames={{
                popoverContent: 'select-popover',
              }}
              popoverProps={{
                placement: 'bottom',
                offset: 5,
                containerPadding: 16,
                portalContainer: document.body,
              }}
              onChange={(e) => {
                const selected = MOCK_VOUCHERS.find(
                  (v) => v.id === e.target.value
                )
                setSelectedVoucher(selected || null)
                setVoucherCode('')
                setVoucherError('')
              }}
            >
              {MOCK_VOUCHERS.map((voucher) => (
                <SelectItem key={voucher.id} textValue={voucher.code}>
                  <div className='flex flex-col'>
                    <span>
                      {voucher.type === 'fixed'
                        ? `Giảm ${voucher.value.toLocaleString()}đ`
                        : `Giảm ${voucher.value}%`}
                    </span>
                    <span className='text-sm text-gray-500'>
                      {voucher.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </Select>

            <div className='flex gap-2'>
              <Input
                placeholder='Nhập mã voucher'
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                color={voucherError ? 'danger' : 'default'}
                errorMessage={voucherError}
                disabled={!!selectedVoucher}
              />
              <Button
                color='primary'
                disabled={!voucherCode || !!selectedVoucher}
                onPress={() => {
                  const found = MOCK_VOUCHERS.find(
                    (v) => v.code.toLowerCase() === voucherCode.toLowerCase()
                  )
                  if (found) {
                    setSelectedVoucher(found)
                    setVoucherError('')
                  } else {
                    setVoucherError('Mã voucher không hợp lệ')
                  }
                }}
              >
                Áp dụng
              </Button>
            </div>
          </div>

          <div className='space-y-3 pb-2'>
            <div className='flex justify-between'>
              <span>Tổng tiền</span>
              <span>{new Intl.NumberFormat('vi-VN').format(subtotal)}đ</span>
            </div>

            {selectedVoucher && voucherDiscount > 0 && (
              <div className='flex justify-between'>
                <span>Giảm giá voucher</span>
                <span className='text-[#FF3B30]'>
                  -{new Intl.NumberFormat('vi-VN').format(voucherDiscount)}đ
                </span>
              </div>
            )}
            {selectedVoucher && voucherDiscount === 0 && (
              <div className='text-sm text-warning-500'>
                *Không thể áp dụng voucher do không đạt giá trị đơn hàng tối
                thiểu
              </div>
            )}
            <Ship
              productValue={subtotal - voucherDiscount}
              weight={1500}
              address={confirmedAddress} // Truyền địa chỉ vào Ship
              onShippingFeeChange={handleShippingFeeChange}
            />
            <div className='flex justify-between border-t pt-3'>
              <span className='font-bold'>Cần thanh toán</span>
              <span className='font-bold text-[#FF3B30]'>
                {new Intl.NumberFormat('vi-VN').format(total)}đ
              </span>
            </div>
          </div>

          {/* Add error messages before the checkout button */}
          {!isValid && renderErrors()}

          <Button
            className='mt-4 h-12 w-full bg-[#338cf1] text-lg font-medium text-white hover:bg-[#338cf1]'
            type='submit'
            onPress={onCheckout}
            isDisabled={!isValid}
          >
            Đặt hàng
          </Button>

          <p className='mt-4 text-center text-sm text-default-500'>
            Bằng việc tiến hành đặt mua hàng, bạn đồng ý với{' '}
            <a href='#' className='text-primary-500'>
              Điều khoản dịch vụ
            </a>{' '}
            và{' '}
            <a href='#' className='text-primary-500'>
              Chính sách xử lý dữ liệu cá nhân
            </a>{' '}
            của HopeStar
          </p>
        </div>
      </Card>
    </div>
  )
}
