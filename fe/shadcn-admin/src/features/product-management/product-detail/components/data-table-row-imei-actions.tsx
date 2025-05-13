import { Row } from '@tanstack/react-table'
import { IconPencil } from '@tabler/icons-react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { useDialog } from '../context/dialog-context'
import { ProductImeiResponseSchema } from '../data/schema'
import { use, useEffect, useState } from 'react'
interface DataTableRowImeiActionsProps<TData> {
  row: Row<TData>;
  data: TData[]
}

export function DataTableRowImeiActions<TData>({
  row,
  data
}: DataTableRowImeiActionsProps<TData>) {
  const { setOpen, setCurrentRow } = useDialog()
  const [statusBill, setStatusBill] = useState(false);
  useEffect(() => {

    const imei = ProductImeiResponseSchema.parse(row.original)
    setStatusBill(imei.checkSatatusBill);
    console.log('Parsed data:', imei.checkSatatusBill)
  }, []);
  const handleUpdateClick = () => {
    try {
      // Thêm logging để debug
      console.log('Row data:', row.original.statusImei)

      // Kiểm tra dữ liệu trước khi parse
      if (!row.original) {
        throw new Error('Không có dữ liệu hàng')
      }

      const imei = ProductImeiResponseSchema.parse(row.original)
      // setStatusBill(imei.checkSatatusBill);
      // Log kết quả parse
      // console.log('Parsed data:', imei)
      // console.log('Parsed data:', data.productImeiResponses.checkSatatusBill)

      setCurrentRow(imei)
      setOpen('update-imei')
    } catch (error) {
      console.error('Lỗi xử lý dữ liệu:', error)
      toast({
        title: 'Lỗi',
        description: 'Dữ liệu không hợp lệ hoặc thiếu thông tin',
        variant: 'destructive',
      })
    }
  }


  return (
    <div className='flex items-center gap-2'>
      <Button
        className="h-10 w-10 bg-yellow-500 hover:bg-gray-500"
        onClick={handleUpdateClick}
        disabled={
          statusBill === false
        }
      >
        <IconPencil size={18} />
      </Button>

    </div>
  )
}
