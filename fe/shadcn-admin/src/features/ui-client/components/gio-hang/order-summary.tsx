import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react'
import { getVoucher } from '../../data/api-cart-service'
import Ship from './ship'
import type { CartItem, Voucher } from './types/cart'

// Thay thế MOCK_VOUCHERS bằng danh sách voucher thực tế từ API của bạn
const MOCK_VOUCHERS: Voucher[] = await getVoucher()
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
  isSubmitting?: boolean
}

export function OrderSummary({
  onCheckout,
  products,
  isValid,
  confirmedAddress,
  errors,
  onValuesChange,
  isSubmitting = false,
}: OrderSummaryProps) {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherError, setVoucherError] = useState('')
  const [shippingFee, setShippingFee] = useState(0)
  const [insuranceFee, setInsuranceFee] = useState(0)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const subtotal = products.reduce(
    (sum, item) => sum + item.priceSell * item.quantity,
    0
  )

  // Chọn voucher có giá trị cao nhất mặc định có thể áp dụng
  useEffect(() => {
    if (!selectedVoucher && subtotal > 0) {
      // Lọc voucher thỏa mãn điều kiện áp dụng
      const availableVouchers = MOCK_VOUCHERS.filter((v) => {
        const meetsMinValue = !v.minOrderValue || subtotal >= v.minOrderValue
        const meetsMaxValue = !v.maxOrderValue || subtotal <= v.maxOrderValue
        return meetsMinValue && meetsMaxValue
      })

      if (availableVouchers.length > 0) {
        // Tính toán giá trị giảm thực tế của từng voucher
        const highestValueVoucher = availableVouchers.reduce(
          (highest, current) => {
            // Tính giá trị giảm của voucher hiện tại
            let currentDiscount = 0
            if (current.type) {
              // Voucher theo phần trăm
              currentDiscount = Math.round(subtotal * (current.value / 100))
              if (current.maxDiscountAmount) {
                currentDiscount = Math.min(
                  currentDiscount,
                  current.maxDiscountAmount
                )
              }
            } else {
              // Voucher giá trị cố định
              currentDiscount = current.value
            }

            // Tính giá trị giảm của voucher cao nhất hiện tại
            let highestDiscount = 0
            if (highest.type) {
              // Voucher theo phần trăm
              highestDiscount = Math.round(subtotal * (highest.value / 100))
              if (highest.maxDiscountAmount) {
                highestDiscount = Math.min(
                  highestDiscount,
                  highest.maxDiscountAmount
                )
              }
            } else {
              // Voucher giá trị cố định
              highestDiscount = highest.value
            }

            return currentDiscount > highestDiscount ? current : highest
          },
          availableVouchers[0]
        )

        setSelectedVoucher(highestValueVoucher)
      } else {
        setSelectedVoucher(null)
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
    if (voucher.maxOrderValue && subtotal > voucher.maxOrderValue) return 0

    let discount = 0
    if (voucher.type) {
      // Voucher theo phần trăm
      discount = Math.round(subtotal * (voucher.value / 100))
      // Kiểm tra giới hạn giảm giá tối đa
      if (voucher.maxDiscountAmount) {
        discount = Math.min(discount, voucher.maxDiscountAmount)
      }
    } else {
      // Voucher giá trị cố định
      discount = voucher.value
    }

    return discount
  }

  const voucherDiscount = calculateVoucherDiscount(selectedVoucher, subtotal)
  const priceAfterDiscount = Math.max(0, subtotal - voucherDiscount)
  const total =
    Math.max(0, subtotal - voucherDiscount) + shippingFee + insuranceFee

  const handleShippingFeeChange = (shipping: number, insurance: number) => {
    setShippingFee(shipping)
    setInsuranceFee(insurance)
  }

  useEffect(() => {
    if (selectedVoucher) {
      setVoucherCode(selectedVoucher.code) // Đồng bộ voucherCode với selectedVoucher
      setVoucherError('') // Xóa lỗi nếu có
    }
  }, [selectedVoucher])

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

  // Create a formatter function to keep code DRY
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value)
  }

  const handleConfirmOrder = () => {
    onClose()
    onCheckout()
  }

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
              value={selectedVoucher?.id.toString() || ''}
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
                  (v) => v.id === parseInt(e.target.value)
                )
                setSelectedVoucher(selected || null)
                setVoucherCode(selected?.code || '') // Đồng bộ voucherCode
                setVoucherError('')
              }}
            >
              {MOCK_VOUCHERS.map((voucher) => (
                <SelectItem
                  key={voucher.id}
                  value={voucher.id.toString()}
                  textValue={`${voucher.code} - ${voucher.name}`}
                >
                  <div className='flex flex-col'>
                    <span className='font-medium'>
                      {voucher.type
                        ? `Giảm ${voucher.value}% (Giảm tối đa ${formatCurrency(
                            voucher.maxDiscountAmount
                          )}đ)`
                        : `Giảm ${formatCurrency(voucher.value)}đ`}
                    </span>
                    <span className='text-sm text-gray-500'>
                      Voucher: {voucher.code} - {voucher.name}
                      <br />
                      {voucher.minOrderValue &&
                        ` Điều kiện: ${formatCurrency(
                          voucher.minOrderValue
                        )} - ${formatCurrency(voucher.maxOrderValue)}đ`}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </Select>

            <div className='flex gap-2'>
              <Input
                placeholder='Nhập mã voucher'
                value={voucherCode} // Hiển thị mã voucher đã chọn
                onChange={(e) => {
                  setVoucherCode(e.target.value)
                  // Clear selected voucher khi nhập mã thủ công
                  if (
                    selectedVoucher &&
                    e.target.value !== selectedVoucher.code
                  ) {
                    setSelectedVoucher(null)
                  }
                }}
                color={voucherError ? 'danger' : 'default'}
                errorMessage={voucherError}
              />
              <Button
                color='primary'
                onPress={() => {
                  const found = MOCK_VOUCHERS.find(
                    (v) => v.code.toLowerCase() === voucherCode.toLowerCase()
                  )
                  if (!found) {
                    setVoucherError('Mã voucher không hợp lệ')
                    return
                  }

                  setSelectedVoucher(found)
                  setVoucherError('')
                }}
              >
                Áp dụng
              </Button>
            </div>
          </div>

          {selectedVoucher && (
            <div className='mt-2 text-sm'>
              <div
                className={
                  voucherDiscount > 0 ? 'text-green-600' : 'text-yellow-600'
                }
              >
                {voucherDiscount > 0 ? (
                  <>Đã áp dụng mã voucher: {selectedVoucher.code}</>
                ) : (
                  `Không thể áp dụng mã voucher "${selectedVoucher.code}" do chưa đạt điều kiện`
                )}
              </div>
            </div>
          )}
          <div className='mt-2 text-sm text-red-600'>
            <span>{voucherError}</span>
          </div>

          <div className='space-y-3 pb-2'>
            <div className='flex justify-between'>
              <span>Tổng tiền hàng:</span>
              <span>{formatCurrency(subtotal)}đ</span>
            </div>

            {selectedVoucher && voucherDiscount > 0 && (
              <div>
                <div className='flex justify-between pb-3'>
                  <span>Giảm giá voucher:</span>
                  <span className='text-[#FF3B30]'>
                    - {formatCurrency(voucherDiscount)}đ
                  </span>
                </div>
                <div className='flex justify-between border-t pt-3'>
                  <span>Tổng tiền:</span>
                  <span className=''>
                    {formatCurrency(priceAfterDiscount)}đ
                  </span>
                </div>
              </div>
            )}
            <Ship
              productValue={subtotal}
              weight={1500}
              address={confirmedAddress} // Truyền địa chỉ vào Ship
              onShippingFeeChange={handleShippingFeeChange}
            />
            <div className='flex justify-between border-t pt-3'>
              <span className='font-bold'>Cần thanh toán:</span>
              <span className='font-bold text-[#FF3B30]'>
                {formatCurrency(total)}đ
              </span>
            </div>
          </div>

          {/* Add error messages before the checkout button */}
          {!isValid && renderErrors()}

          <Button
            className='mt-4 h-12 w-full bg-[#338cf1] text-lg font-medium text-white hover:bg-[#338cf1]'
            type='submit'
            onPress={onOpen}
            isDisabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <div className='flex items-center gap-2'>
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                <span>Đang xử lý...</span>
              </div>
            ) : (
              'Đặt hàng'
            )}
          </Button>

          <Modal isOpen={isOpen} onClose={onClose} size='sm'>
            <ModalContent>
              <ModalHeader className='flex flex-col gap-1'>
                Xác nhận đặt hàng
              </ModalHeader>
              <ModalBody>
                <p>Bạn có chắc chắn muốn đặt đơn hàng này?</p>
                <div className='mt-2 space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span>Số lượng sản phẩm:</span>
                    <span className='font-medium'>{products.length}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Tổng tiền:</span>
                    <span className='font-medium text-[#FF3B30]'>
                      {formatCurrency(total)}đ
                    </span>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  variant='light'
                  className='border'
                  onPress={onClose}
                >
                  Hủy
                </Button>
                <Button color='primary' onPress={handleConfirmOrder}>
                  Xác nhận
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <p className='mt-4 text-center text-sm text-default-500'>
            Bằng việc tiến hành đặt mua hàng, bạn đồng ý với{' '}
            <a href='chinh-sach-cua-cua-hang' className='text-primary-500'>
              Điều khoản dịch vụ
            </a>{' '}
            và{' '}
            <a href='chinh-sach-cua-cua-hang' className='text-primary-500'>
              Chính sách xử lý dữ liệu cá nhân
            </a>{' '}
            của HopeStar
          </p>
        </div>
      </Card>
    </div>
  )
}
