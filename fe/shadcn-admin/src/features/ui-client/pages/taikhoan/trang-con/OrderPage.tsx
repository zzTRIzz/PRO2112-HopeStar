import React from 'react'
import { Input, Tabs, Tab, Card, CardBody, Button, Link } from '@heroui/react'
import { Icon } from '@iconify/react'

interface OrderItem {
  id: string
  image: string
  name: string
  quantity: number
  price: number
  date: string
  deliveryMethod: string
  status: 'processing' | 'shipping' | 'completed' | 'cancelled' | 'returned'
}

const statusConfig = {
  processing: { color: '#f5a524', text: 'Đang xử lý' },
  shipping: { color: '#007bff', text: 'Đang giao' },
  completed: { color: '#17c964', text: 'Hoàn tất' },
  cancelled: { color: '#dc3545', text: 'Đã hủy' },
  returned: { color: '#6c757d', text: 'Trả hàng' },
}

const sampleOrders: OrderItem[] = [
  {
    id: 'ORD123456',
    image: 'https://cdn2.fptshop.com.vn/unsafe/128x0/filters:quality(100)/iphone_16_ultramarine_523066aa94.png',
    name: 'iPhone 16 128GB Xanh Lưu Ly',
    quantity: 1,
    price: 19290000,
    date: '27/03/2025',
    deliveryMethod: 'Giao hàng tận nơi',
    status: 'completed',
  },
  {
    id: 'ORD123457',
    image: 'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_teal_09fe254c00.png',
    name: 'iPhone 16 128GB Xanh Mòng Két',
    quantity: 1,
    price: 19290000,
    date: '27/03/2025',
    deliveryMethod: 'Giao hàng tận nơi',
    status: 'shipping',
  },
  {
    id: 'ORD123458',
    image: 'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_black_fe52c5d947.png',
    name: 'iPhone 16 128GB Đen Nhám',
    quantity: 1,
    price: 19290000,
    date: '27/03/2025',
    deliveryMethod: 'Giao hàng tận nơi',
    status: 'processing',
  },
  {
    id: 'ORD789012',
    image: 'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:quality(100)/iphone_16_pink_23227ae794.png',
    name: 'iPhone 16 128GB Hồng Đào',
    quantity: 2,
    price: 18290000,
    date: '28/03/2025',
    deliveryMethod: 'Nhận tại cửa hàng',
    status: 'cancelled',
  },
  
]

export const OrdersPage = () => {
  const [selected, setSelected] = React.useState('all')

  const filteredOrders = selected === 'all' 
    ? sampleOrders 
    : sampleOrders.filter(order => order.status === selected)

  return (
    <div>
      <div className='mx-auto max-w-5xl'>
        <header className='mb-6 flex items-center justify-between'>
          <h1 className='text-xl font-bold text-[#333333]'>Đơn hàng của tôi</h1>
          <Input
            placeholder='Tìm theo tên đơn, mã đơn hoặc tên sản phẩm'
            startContent={<Icon icon='lucide:search' className='text-default-400' />}
            className='w-96'
          />
        </header>

        <Tabs
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key as string)}
          color='primary'
        >
          <Tab key='all' title='Tất cả' />
          <Tab key='processing' title='Đang xử lý' />
          <Tab key='shipping' title='Đang giao' />
          <Tab key='completed' title='Hoàn tất' />
          <Tab key='cancelled' title='Đã hủy' />
          <Tab key='returned' title='Trả hàng' />
        </Tabs>

        {filteredOrders.length === 0 ? (
          <div className="p-4 bg-white rounded-lg border border-gray-200 mt-6">
            <p className="text-[#A0A0A0] text-center py-8">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className='mt-6'>
              <CardBody>
                <div className='flex items-start justify-between border-b border-default-100 pb-4'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-4 text-sm text-default-600'>
                      <span>{order.date}</span>
                      <span>{order.deliveryMethod}</span>
                      <span>{order.quantity} sản phẩm</span>
                    </div>
                  </div>

                  <div className='flex flex-col items-end gap-2'>
                    <div className='flex items-center gap-2 text-sm font-medium text-default-600'>
                      <span style={{ color: statusConfig[order.status].color }}>•</span>
                      <span style={{ color: statusConfig[order.status].color }}>
                        {statusConfig[order.status].text}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='mt-4 flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <img
                      src={order.image}
                      alt={order.name}
                      className='h-20 w-20 rounded-lg object-cover'
                    />
                    <div className='space-y-1'>
                      <Link className='text-sm font-medium hover:text-[#4c7eea]'>
                        {order.name}
                      </Link>
                      <p className='text-sm text-default-500'>
                        Số lượng: {order.quantity}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-bold'>
                      {order.price.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                </div>

                <div className='mt-4 flex items-center justify-between border-t border-default-100 pt-4'>
                  <p className='text-sm text-default-600'>
                    Bạn cần hỗ trợ? Liên hệ ngay với chúng tôi.
                  </p>
                  <Button
                    color='danger'
                    variant='solid'
                    startContent={<Icon icon='lucide:headphones' />}
                    className='bg-[#4072dd] hover:bg-[#3b6bc4] text-white rounded-lg px-4 py-2'
                  >
                    Hỗ trợ
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}