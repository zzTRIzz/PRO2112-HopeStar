import { Row } from '@tanstack/react-table'
import { IconPencil } from '@tabler/icons-react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { useDialog } from '../context/dialog-context'
import { ProductImeiResponseSchema } from '../data/schema'

interface DataTableRowImeiActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowImeiActions<TData>({
  row,
}: DataTableRowImeiActionsProps<TData>) {
  const { setOpen, setCurrentRow } = useDialog()

  const handleUpdateClick = () => {
    try {
      // Thêm logging để debug
      console.log('Row data:', row.original)

      // Kiểm tra dữ liệu trước khi parse
      if (!row.original) {
        throw new Error('Không có dữ liệu hàng')
      }

      const imei = ProductImeiResponseSchema.parse(row.original)

      // Log kết quả parse
      console.log('Parsed data:', imei)

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
        className='h-10 w-10 bg-yellow-500 hover:bg-gray-500'
        onClick={handleUpdateClick}
        // Disable nút nếu không có dữ liệu hợp lệ
        disabled={!row.original}
      >
        <IconPencil size={18} />
      </Button>
    </div>
  )
}
