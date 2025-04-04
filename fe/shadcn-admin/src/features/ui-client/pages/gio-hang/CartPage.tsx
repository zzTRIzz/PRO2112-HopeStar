import { useNavigate } from '@tanstack/react-router'
import { Button, Card, Checkbox, Spinner } from '@heroui/react'
import { Icon } from '@iconify/react'
import { CartItemCard } from '../../components/gio-hang/cart-item'
import { useCart } from '../../hooks/use-cart'

export function CartPage() {
  const {
    cart,
    isLoading,
    selectedItems,
    refreshCart,
    updateQuantity,
    deleteItem,
    selectItem,
    selectAll,
    deleteSelected,
  } = useCart()
  const navigate = useNavigate()

  const cartItems = cart?.cartDetailResponseList || []

  const selectedProducts = cartItems.filter((item) =>
    selectedItems.has(item.id)
  )
  const totalAmount = selectedProducts.reduce(
    (sum, item) => sum + item.priceSell * item.quantity,
    0
  )

  const handleProceedToCheckout = () => {
    navigate({
      to: '/dat-hang',
      search: {
        selectedProducts: JSON.stringify(selectedProducts),
      },
    })
  }

  if (isLoading) {
    return (
      <div className='flex h-[400px] items-center justify-center'>
        <Spinner size='lg' label='Đang tải...' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#F7F7F7] p-4 md:p-6'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <h1 className='text-2xl font-bold'>
              Giỏ hàng của bạn ({cartItems.length})
            </h1>
            {cartItems.length > 0 && (
              <Checkbox
                isSelected={
                  cartItems.length > 0 &&
                  selectedItems.size === cartItems.length
                }
                onValueChange={selectAll}
                className='ml-2'
              >
                Chọn tất cả
              </Checkbox>
            )}
          </div>
          <div className='flex items-center gap-3'>
            <Button
              color='danger'
              variant='flat'
              startContent={<Icon icon='lucide:trash-2' className='h-4 w-4' />}
              onPress={deleteSelected}
              isDisabled={isLoading || selectedItems.size === 0}
            >
              Xóa đã chọn
            </Button>
            <Button
              color='primary'
              startContent={
                <Icon icon='lucide:refresh-cw' className='h-4 w-4' />
              }
              onPress={refreshCart}
              isDisabled={isLoading}
            >
              Làm mới giỏ hàng
            </Button>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            {isLoading ? (
              <div className='flex h-[400px] items-center justify-center'>
                <Spinner size='lg' label='Đang tải...' />
              </div>
            ) : cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.has(item.id)}
                  onSelect={(isSelected) => selectItem(item.id, isSelected)}
                  onUpdateQuantity={(quantity) =>
                    updateQuantity(item.id, quantity)
                  }
                  onDelete={() => deleteItem(item.id)}
                />
              ))
            ) : (
              <div className='flex h-[400px] flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-default-200'>
                <Icon
                  icon='lucide:shopping-cart'
                  className='h-12 w-12 text-default-300'
                />
                <p className='text-lg text-default-500'>Giỏ hàng trống</p>
                <Button
                  color='primary'
                  variant='flat'
                  onPress={refreshCart}
                  startContent={
                    <Icon icon='lucide:refresh-cw' className='h-4 w-4' />
                  }
                >
                  Thêm sản phẩm mẫu
                </Button>
              </div>
            )}
          </div>

          <div className='lg:col-span-1'>
            <Card className='sticky top-4'>
              <div className='space-y-4 p-6'>
                <h2 className='text-xl font-bold'>Tổng quan đơn hàng</h2>

                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span>Số sản phẩm đã chọn</span>
                    <span>{selectedProducts.length}</span>
                  </div>
                  <div className='flex justify-between font-bold'>
                    <span>Tổng tiền</span>
                    <span className='text-danger'>
                      {new Intl.NumberFormat('vi-VN').format(totalAmount)}₫
                    </span>
                  </div>
                </div>

                <Button
                  className='w-full bg-[#338cf1] text-white'
                  size='lg'
                  onPress={handleProceedToCheckout}
                  isDisabled={selectedProducts.length === 0}
                >
                  Tiến hành đặt hàng
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
