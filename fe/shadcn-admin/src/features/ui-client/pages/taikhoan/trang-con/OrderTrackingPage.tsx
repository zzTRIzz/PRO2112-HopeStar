import { Card, CardBody, Progress, Chip } from '@heroui/react'
import { Icon } from '@iconify/react'
import { Bill } from '../service/schema'
import { useState, useEffect } from 'react'
import { getBillAllClientByAccount } from '../service/api-bill-client-service'

const orderStatusSteps = [
  {
    id: 1,
    statuses: ['CHO_XAC_NHAN', 'CHO_THANH_TOAN'],
    label: 'Chờ xác nhận',
    icon: 'lucide:hourglass',
  },
  {
    id: 2,
    statuses: ['DA_XAC_NHAN'],
    label: 'Đã xác nhận',
    icon: 'lucide:check-square',
  },
  {
    id: 3,
    statuses: ['DANG_CHUAN_BI_HANG'],
    label: 'Đang chuẩn bị hàng',
    icon: 'lucide:box',
  },
  {
    id: 4,
    statuses: ['DANG_GIAO_HANG'],
    label: 'Đang giao hàng',
    icon: 'lucide:truck',
  },
  {
    id: 5,
    statuses: ['HOAN_THANH'],
    label: 'Hoàn tất',
    icon: 'lucide:check-circle',
  },
];

const statusConfig = {
  CHO_XAC_NHAN: { color: '#f5a524', text: 'Chờ xác nhận' },
  CHO_THANH_TOAN: { color: '#f5a524', text: 'Chờ xác nhận' },
  DA_XAC_NHAN: { color: '#339999', text: 'Đã xác nhận' },
  DANG_CHUAN_BI_HANG: { color: '#FF0099', text: 'Đang chuẩn bị hàng' },
  DANG_GIAO_HANG: { color: '#007bff', text: 'Đang giao' },
  HOAN_THANH: { color: '#17c964', text: 'Hoàn tất' },
  DA_HUY: { color: '#dc3545', text: 'Đã hủy' },
}

const getPaymentMethod = (method: number | null) => {
  switch (method) {
    case 1: return "Tiền mặt";
    case 2: return "Chuyển khoản";
    case 3: return "Ví VNPAY";
    case 4: return `COD - Thanh toán khi nhận hàng`;
    default: return "";
  }
};
const OrderTrackingPage = () => {
  const [bill, setBill] = useState<Bill | null>(null);
  const urlParams = new URLSearchParams(window.location.search);
  const id = Number(urlParams.get("id"));
  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await getBillAllClientByAccount(id)
        setBill(response.data)
        console.log('Bill data:', response)
      } catch (error) {
        console.error('Error fetching bill:', error)
      }
    }
    fetchBill()
  }
    , [id]);

  if (!bill) return <div>Đang tải...</div>;



  const getCurrentStep = () => {
    if (bill?.status === 'DA_HUY') return -1;
    return orderStatusSteps.findIndex(step =>
      step.statuses.includes(bill?.status || '')
    );
  };

  const calculateProgress = () => {
    const currentStep = getCurrentStep();
    if (currentStep === -1) return 0;
    return ((currentStep + 1) / orderStatusSteps.length) * 100;
  };


  return (
    <div className='min-h-screen bg-[#F7F7F7] p-4 md:p-4'>
      <div className='mx-auto max-w-6xl space-y-2'>
        <div className='flex items-center gap-1 text-sm ml-[6px]'>
          <a href="/taikhoan/don-hang-cua-toi" className='text-blue-600'>Đơn hàng của tôi</a>
          <span className='text-gray-400'>{'>'}</span>
          <a href="" className='text-cyan-600'>Chi tiết đơn hàng</a>
        </div>
        <Card className='border-none shadow-sm'>
          <CardBody>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div className='space-y-1'>
                <p className='text-sm text-default-500 '>
                  {bill?.paymentDate ? new Date(bill?.paymentDate).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                  })
                    : ""}</p>
                <div className='flex items-center gap-2'>
                  <h1 className='text-lg font-bold'>Mã đơn hàng: <span className='text-green-600'>{bill?.maBill}</span> </h1>
                  <Chip color='primary' variant='flat' size='sm'
                    className='ml-[28px]'
                  >
                    {statusConfig[bill?.status].text}
                  </Chip>
                </div>
              </div>
              <p className='text-sm mr-[30px]'>{bill?.detailCount} sản phẩm</p>
            </div>
          </CardBody>
        </Card>
        {/* Order Timeline - Đổi màu chính ở đây */}
        <Card className="border-none shadow-sm h-[110px]">
          <CardBody>
            {bill?.status === 'DA_HUY' ? (
              <div className="absolute inset-0 bg-red-100 flex items-center justify-center rounded-lg ">
                <div className="flex items-center gap-2 text-red-600">
                  <Icon icon="lucide:alert-circle" width={24} />
                  <span className="font-medium">Đơn hàng đã hủy</span>
                </div>
              </div>
            ) : (
              <div className="relative flex justify-between">
                <Progress
                  aria-label="Order Progress"
                  value={calculateProgress()}
                  className="absolute left-0 right-0 top-1/2 -z-10 h-1"
                />

                {orderStatusSteps.map((step) => {
                  const currentStep = getCurrentStep();
                  const isDone = currentStep >= step.id - 1;
                  const isCurrent = step.statuses.includes(bill?.status);
                  const statusColor = statusConfig[bill?.status]?.color;

                  return (
                    <div key={step.id} className="flex flex-col items-center gap-2">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${isDone ? 'bg-opacity-100' : 'bg-default-100'
                          }`}
                        style={{
                          backgroundColor: isDone ? statusColor : undefined,
                        }}
                      >
                        <Icon
                          icon={step.icon}
                          className={isDone ? 'text-white' : 'text-default-400'}
                          width={24}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${isCurrent ? 'text-[${statusColor}]' : ''
                          }`}
                        style={{ color: isCurrent ? statusColor : undefined }}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
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
                    <span className='font-medium'>{bill?.name}</span>
                  </p>
                  <p className='text-sm text-default-500'>
                    {/* {bill?.phone} */}
                    {bill?.phone ? bill?.phone.slice(0, -3) + '***' : ''}
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Delivery Address */}
            <Card className='border-none shadow-sm'>
              <CardBody>
                <h2 className='mb-4 font-semibold'>Nhận hàng tại</h2>
                <p className='text-sm'>
                  {/* {bill?.address} */}
                  {bill?.address != null ? bill?.address.replace(/^[^,]+/, '***') : "Chưa có địa chỉ"};

                </p>
              </CardBody>
            </Card>

            {/* Product List */}
            <Card className='border-none shadow-sm'>
              <CardBody>
                <h2 className='mb-4 font-semibold'>Danh sách sản phẩm</h2>
                <div className='space-y-4'>
                  {bill?.billDetailResponesList?.map((bd) => (
                    <div className='flex items-center gap-4'>
                      <img
                        src={bd.productDetail.image}
                        alt={bd.productDetail.image}
                        className='h-[120px] w-[100px] rounded-md object-cover'
                      />
                      <div className='flex-1'>
                        <p className='font-medium'>
                          {bd?.productDetail?.productName
                            + ' ' + bd?.productDetail?.ram
                            + '/' + bd?.productDetail?.rom+bd?.productDetail?.descriptionRom
                            + ' - ' + bd?.productDetail?.color}
                        </p>
                        <p className='text-sm text-default-500'>Số lượng: {bd?.quantity}</p>
                      </div>
                      <p className='font-semibold'>{bd.totalPrice.toLocaleString("vi-VN")} VNĐ</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Payment Info */}
          <Card className='h-fit border-none shadow-sm'>
            <CardBody>
              <h2 className='mb-4 font-semibold'>Thông tin thanh toán</h2>
              <div className='space-y-4'>
                <div className='flex justify-between  text-danger-500'>
                  <span className='text-sm'>Tổng tiền</span>
                  <span className='font-bold' >{bill?.totalPrice != null ? bill?.totalPrice.toLocaleString("vi-VN") : 0} đ</span>
                </div>
                {/* <div className='flex justify-between text-danger-500'>
                  <span className='text-sm'>Giảm giá trực tiếp</span>
                  <span>0 đ</span>
                </div> */}
                <div className='flex justify-between'>
                  <span className='text-sm'>Giảm giá voucher</span>
                  <span className='font-bold '>{bill?.discountedTotal != null ? bill?.discountedTotal.toLocaleString("vi-VN") : 0} đ</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm'>Phí vận chuyển</span>
                  <span className='font-bold '>{bill?.deliveryFee != null ? bill?.deliveryFee.toLocaleString("vi-VN") : 0} đ</span>
                </div>
                {/* {bill?.payInsurance&&( */}
                <div className='flex justify-between'>
                  <span className='text-sm'>Phí bảo hiểm</span>
                  <span className='font-bold '>{bill?.payInsurance != null ? bill?.payInsurance?.toLocaleString("vi-VN") : 0} đ</span>
                </div>
                {/* )} */}
                <div className='border-t pt-4'>
                  <div className='flex justify-between text-danger-500'>
                    <span className='font-medium'>Thành tiền</span>
                    <span className='text-xl font-bold '>
                      {bill?.totalDue ? bill?.totalDue.toLocaleString("vi-VN") : 0} đ

                    </span>
                  </div>
                </div>
                <div className='flex items-center justify-between gap-x-4 rounded-lg bg-default-50 p-3'>
                  <div className='flex flex-1 items-center gap-2'>
                    <Icon icon='lucide:wallet' width={20} />
                    <span className='text-sm font-medium'>
                      {/* COD - Thanh toán khi nhận hàng */}
                      {getPaymentMethod(bill?.payment)}
                    </span>
                  </div>
                  {/* <Chip color='warning' size='sm'>
                    Chưa thanh toán
                  </Chip> */}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      <br />
    </div>
  )
}

export default OrderTrackingPage
