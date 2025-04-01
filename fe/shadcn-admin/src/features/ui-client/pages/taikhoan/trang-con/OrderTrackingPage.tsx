import { Card, CardBody, Progress, Chip } from '@heroui/react'
import { Icon } from '@iconify/react'

const orderStatuses = [
  { id: 1, label: 'Đặt hàng', icon: 'lucide:receipt', done: true },
  { id: 2, label: 'Đang xử lý', icon: 'lucide:package', done: true },
  { id: 3, label: 'Đang giao', icon: 'lucide:truck', done: false },
  { id: 4, label: 'Hoàn tất', icon: 'lucide:check-circle', done: false },
]

const OrderTrackingPage = () => {
  return (
    <div className='min-h-screen bg-[#F7F7F7] p-4 md:p-6'>
      <div className='mx-auto max-w-6xl space-y-4'>
        {/* Order Header */}
        <Card className='border-none shadow-sm'>
          <CardBody>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div className='space-y-1'>
                <p className='text-sm text-default-500'>27/03/2025</p>
                <div className='flex items-center gap-2'>
                  <h1 className='text-lg font-bold'>Đơn hàng #6711485</h1>
                  <Chip color='warning' variant='flat' size='sm'>
                    Đang xử lý
                  </Chip>
                </div>
              </div>
              <p className='text-sm'>1 sản phẩm</p>
            </div>
          </CardBody>
        </Card>

        {/* Order Timeline - Đổi màu chính ở đây */}
        <Card className='border-none shadow-sm'>
          <CardBody>
            <div className='relative flex justify-between'>
              <Progress
                aria-label='Order Progress'
                value={50}
                className='absolute left-0 right-0 top-1/2 -z-10 h-1'
              />
              {orderStatuses.map((status) => (
                <div
                  key={status.id}
                  className='flex flex-col items-center gap-2'
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      status.done ? 'bg-primary-500' : 'bg-default-100' // Đổi từ success sang primary
                    }`}
                  >
                    <Icon
                      icon={status.icon}
                      className={
                        status.done ? 'text-white' : 'text-default-400'
                      }
                      width={24}
                    />
                  </div>
                  <span className='text-sm font-medium'>{status.label}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className='grid gap-4 md:grid-cols-3'>
          <div className='space-y-4 md:col-span-2'>
            {/* Recipient Info */}
            <Card className='border-none shadow-sm'>
              <CardBody>
                <h2 className='mb-4 font-semibold'>Thông tin người nhận</h2>
                <div className='space-y-2'>
                  <p className='text-sm'>
                    <span className='font-medium'>Nguyễn Quốc Trí</span>
                  </p>
                  <p className='text-sm text-default-500'>0358168xxx</p>
                </div>
              </CardBody>
            </Card>

            {/* Delivery Address */}
            <Card className='border-none shadow-sm'>
              <CardBody>
                <h2 className='mb-4 font-semibold'>Nhận hàng tại</h2>
                <p className='text-sm'>
                  xxx, Phường Phương Canh, Quận Nam Từ Liêm, Hà Nội
                </p>
              </CardBody>
            </Card>

            {/* Product List */}
            <Card className='border-none shadow-sm'>
              <CardBody>
                <h2 className='mb-4 font-semibold'>Danh sách sản phẩm</h2>
                <div className='space-y-4'>
                  <div className='flex items-center gap-4'>
                    <img
                      src='https://picsum.photos/60/60'
                      alt='Product'
                      className='h-15 w-15 rounded-md object-cover'
                    />
                    <div className='flex-1'>
                      <p className='font-medium'>
                        Pin Alkaline AAA Vỉ 2 viên MAXELL LR03 (GD)2B
                      </p>
                      <p className='text-sm text-default-500'>Số lượng: 1</p>
                    </div>
                    <p className='font-semibold'>20.000 đ</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Payment Info */}
          <Card className='h-fit border-none shadow-sm'>
            <CardBody>
              <h2 className='mb-4 font-semibold'>Thông tin thanh toán</h2>
              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-sm'>Tổng tiền</span>
                  <span className='font-medium'>30.000 đ</span>
                </div>
                <div className='flex justify-between text-danger-500'>
                  <span className='text-sm'>Giảm giá trực tiếp</span>
                  <span>-0 đ</span>
                </div>
                <div className='flex justify-between text-danger-500'>
                  <span className='text-sm'>Giảm giá voucher</span>
                  <span>-0 đ</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm'>Phí vận chuyển</span>
                  <span>10.000 đ</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm'>Điểm tích lũy</span>
                  <span className='flex items-center gap-1'>
                    <Icon icon='lucide:coin' className='text-warning-500' />
                    +5
                  </span>
                </div>
                <div className='border-t pt-4'>
                  <div className='flex justify-between'>
                    <span className='font-medium'>Thành tiền</span>
                    <span className='text-xl font-bold text-danger-500'>
                      30.000 đ
                    </span>
                  </div>
                </div>
                <div className='flex items-center justify-between gap-x-4 rounded-lg bg-default-50 p-3'>
                  <div className='flex flex-1 items-center gap-2'>
                    <Icon icon='lucide:wallet' width={20} />
                    <span className='text-sm font-medium'>
                      COD - Thanh toán khi nhận hàng
                    </span>
                  </div>
                  <Chip color='warning' size='sm'>
                    Chưa thanh toán
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default OrderTrackingPage
