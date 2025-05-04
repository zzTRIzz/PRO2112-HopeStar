import React, { useEffect, useState } from 'react'
import { Card, CardBody, Input, Link, Tab, Tabs } from '@heroui/react'
import { Icon } from '@iconify/react'
import { Button } from '@/features/ui-client/components/ui/button'
import { getBillByAccount } from '../service/api-bill-client-service'
import { Bill } from '../service/schema'

const statusConfig = {
  CHO_XAC_NHAN: { color: '#f5a524', text: 'Chờ xác nhận' },
  // CHO_THANH_TOAN: { color: '#f5a524', text: 'Chờ xác nhận' },
  DA_XAC_NHAN: { color: '#339999', text: 'Đã xác nhận' },
  DANG_CHUAN_BI_HANG: { color: '#FF0099', text: 'Đang chuẩn bị hàng' },
  DANG_GIAO_HANG: { color: '#007bff', text: 'Đang giao hàng' },
  HOAN_THANH: { color: '#17c964', text: 'Hoàn thành' },
  DA_HUY: { color: 'red', text: 'Đã hủy' },
}

export const OrdersPage = () => {
  const [selected, setSelected] = React.useState('all')
  const [bills, setBills] = useState<Bill[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [displayLimit, setDisplayLimit] = useState(2)
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await getBillByAccount()
        setBills(data)
        console.log('Bills:', data)
      } catch (error) {
        console.error('Lỗi lấy bill:', error)
      }
    }

    fetchBills()
  }, [])

  const filteredOrders = bills
    .filter((bill) => {
      // Lọc theo trạng thái
      if (selected !== 'all') {
        if (selected === 'CHO_XAC_NHAN') {
          if (bill.status !== 'CHO_XAC_NHAN') {
            return false;
          }
        } else if (bill.status !== selected) {
          return false
        }
      }

      // Lọc theo từ khóa tìm kiếm
      if (searchKeyword.trim() !== '') {
        const keyword = searchKeyword.toLowerCase();
        const matchesCode = bill?.maBill?.toLowerCase().includes(keyword.trim());
        const matchesProduct = bill?.billDetailResponesList?.some((detail) =>
          detail.productDetail?.productName?.toLowerCase().includes(keyword)
        )
        return matchesCode || matchesProduct
      }

      return true
    })
    .filter(
      (bill) =>
        bill.billDetailResponesList && bill.billDetailResponesList.length > 0
    )

  return (
    <div>
      <section className='mx-auto max-w-5xl'>
        <header className='mb-6 flex items-center justify-between'>
          <h1 className='text-xl font-bold text-[#333333]'>Đơn hàng của tôi</h1>
          <Input
            placeholder='Tìm theo mã đơn hoặc tên sản phẩm'
            startContent={
              <Icon icon='lucide:search' className='text-default-400' />
            }
            className='w-96'
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </header>

        <Tabs
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key as string)}
          color='primary'
        >
          <Tab key='all' title='Tất cả' />
          <Tab key='CHO_XAC_NHAN' title='Chờ xác nhận' />
          <Tab key='DA_XAC_NHAN' title='Đã xác nhận' />
          <Tab key='DANG_CHUAN_BI_HANG' title='Đang chuẩn bị hàng' />
          <Tab key='DANG_GIAO_HANG' title='Đang giao hàng' />
          <Tab key='HOAN_THANH' title='Hoàn thành' />
          <Tab key='DA_HUY' title='Đã hủy' />
        </Tabs>

        {filteredOrders.length === 0 ? (
          <div className='mt-6 rounded-lg border border-gray-200 bg-white p-4'>
            <p className='py-8 text-center text-[#A0A0A0]'>
              Chưa có đơn hàng nào
            </p>
          </div>
        ) : (
          filteredOrders.slice(0, displayLimit).map((order) => (
            <Card key={order?.id} className='mt-6'>
              <CardBody>
                <div className='flex items-start justify-between border-b border-default-100 pb-4'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-4 text-sm text-default-600'>
                      <span>
                        {order?.paymentDate
                          ? new Date(order?.paymentDate)?.toLocaleDateString(
                            'vi-VN',
                            {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            }
                          )
                          : ''}
                      </span>
                      <span>Mã đơn hàng: {order?.maBill}</span>
                      <span>
                        {order?.detailCount != null ? order?.detailCount : 0}{' '}
                        sản phẩm
                      </span>
                    </div>
                  </div>
                  <div className='flex flex-col items-end gap-2'>
                    <div className='flex items-center gap-2 text-sm font-medium text-default-600'>
                      <span
                        style={{ color: statusConfig[order?.status]?.color }}
                      >
                        •
                      </span>
                      <span
                        style={{ color: statusConfig[order?.status]?.color }}
                      >
                        {statusConfig[order?.status]?.text}
                      </span>
                    </div>
                  </div>
                </div>
                {order?.billDetailResponesList?.[0] && (
                  <div className='mt-4 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <img
                        src={
                          order?.billDetailResponesList[0]?.productDetail?.image
                        }
                        alt={
                          order?.billDetailResponesList[0]?.productDetail
                            ?.productName
                        }
                        className='h-20 w-20 rounded-lg object-cover'
                      />
                      <div className='space-y-1'>
                        <Link
                          href={`/taikhoan/don-hang-cua-toi/thong-tin?id=${order?.id}`}
                          className='text-sm font-medium hover:text-[#4c7eea]'
                        >
                          {order?.billDetailResponesList[0]?.productDetail
                            ?.productName +
                            ' ' +
                            order?.billDetailResponesList[0]?.productDetail
                              ?.ram +
                            '/' +
                            order?.billDetailResponesList[0]?.productDetail
                              ?.rom +
                            order?.billDetailResponesList[0]?.productDetail
                              ?.descriptionRom +
                            ' - ' +
                            order?.billDetailResponesList[0]?.productDetail
                              ?.color}{' '}
                          <br />
                        </Link>
                        <p className='text-sm text-default-500'>
                          Số lượng: {order?.billDetailResponesList[0]?.quantity}
                        </p>
                        <p className='text-sm font-bold'>
                          {order?.billDetailResponesList[0]?.totalPrice?.toLocaleString(
                            'vi-VN'
                          )}{' '}
                          đ
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-lg font-bold text-red-500'>
                        {order?.totalDue != null
                          ? order?.totalDue?.toLocaleString('vi-VN')
                          : 0}{' '}
                        đ
                      </p>
                    </div>
                  </div>
                )}
                {/* <div className='flex items-center gap-4'>
                    <img
                      src={order.billDetailResponesList[0].productDetail?.image}
                      alt={order.name}
                      className='h-20 w-20 rounded-lg object-cover'
                    />
                    <div>
                      <p>{order.billDetailResponesList[0].productDetail?.productName}</p>
                      <p>Số lượng: {order.billDetailResponesList[0].quantity}</p>
                    </div>
                  </div> */}

                {/* <div className='mt-4 flex items-center justify-between border-t border-default-100 pt-4'>
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
                </div> */}
              </CardBody>
            </Card>
          ))
        )}
        {filteredOrders.length > displayLimit && (
          <div className='mt-6 flex justify-center'>
            <Button
              variant='outline'
              onClick={() => setDisplayLimit((prev) => prev + 2)}
              className='px-8'
            >
              Xem thêm
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
