import { Button, Card, CardBody, Checkbox } from '@heroui/react'
import { Icon } from '@iconify/react'

// Define the type for cart item
interface CartItemType {
  id: number
  productName: string
  quantity: number
  ram: string
  rom: string
  color: string
  image: string
  price: number
  priceSell: number
}

interface CartItemProps {
  item: CartItemType
  isSelected: boolean
  onSelect: (isSelected: boolean) => void
  onUpdateQuantity: (quantity: number) => void
  onDelete: () => void
}

export function CartItemCard({
  item,
  isSelected,
  onSelect,
  onUpdateQuantity,
  onDelete,
}: CartItemProps) {
  const MAX_QUANTITY = 5

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.min(
      MAX_QUANTITY,
      Math.max(1, item.quantity + delta)
    )
    if (newQuantity !== item.quantity) {
      onUpdateQuantity(newQuantity)
    }
  }

  return (
    <Card className='mb-4'>
      <CardBody>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
          <div className='flex items-center gap-4'>
            <Checkbox
              isSelected={isSelected}
              onValueChange={onSelect}
              aria-label={`Select ${item.productName}`}
            />
            {/* Add Image display */}
            <div className='h-32 w-24 overflow-hidden rounded-md'>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.productName}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center bg-default-100'>
                  <Icon
                    icon='lucide:image'
                    className='h-8 w-8 text-default-400'
                  />
                </div>
              )}
            </div>
          </div>
          <div className='flex-grow space-y-3'>
            <div>
              <h3 className='text-lg font-semibold text-foreground'>
                {item.productName}
              </h3>
              <p className='text-sm text-default-500'>
                {item.ram}/{item.rom} - {item.color}
              </p>
            </div>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div className='space-x-2 space-y-1'>
                <span className='text-lg font-bold text-danger'>
                  {new Intl.NumberFormat('vi-VN').format(item.priceSell)}₫
                </span>

                {item.price !== item.priceSell && (
                  <span className='text-sm text-default-500 line-through'>
                    {new Intl.NumberFormat('vi-VN').format(item.price)}₫
                  </span>
                )}
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  isIconOnly
                  variant='solid'
                  size='sm'
                  onPress={() => handleQuantityChange(-1)}
                  aria-label='Decrease quantity'
                  isDisabled={item.quantity <= 1}
                >
                  <Icon icon='lucide:minus' className='h-4 w-4' />
                </Button>
                <span className='w-12 text-center text-medium'>
                  {item.quantity}
                </span>
                <Button
                  isIconOnly
                  variant='solid'
                  size='sm'
                  onPress={() => handleQuantityChange(1)}
                  aria-label='Increase quantity'
                  isDisabled={item.quantity >= MAX_QUANTITY}
                >
                  <Icon icon='lucide:plus' className='h-4 w-4' />
                </Button>
                <Button
                  isIconOnly
                  variant='flat'
                  color='danger'
                  size='sm'
                  onPress={onDelete}
                  aria-label='Remove item'
                >
                  <Icon icon='lucide:trash-2' className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
