import { Row } from '@tanstack/react-table'
import { IconEye, IconPencil } from '@tabler/icons-react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { useProduct } from '../context/product-context'
import { productResponseSchema } from '../data/schema'

// Assuming you're using a toast library for notifications

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { setOpen, setCurrentRow } = useProduct()

  const handleViewClick = () => {
    try {
      console.log('Row data:', row.original)
      const product = productResponseSchema.parse(row.original)
      console.log('Parsed product:', product) // Log the parsed product for debugging
      setCurrentRow(product)
      setOpen('display')
    } catch (error) {
      console.error('Lỗi xử lý dữ liệu:', error)
      toast.error('Invalid product data')
    }
  }

  const handleUpdateClick = () => {
    try {
      const product = productResponseSchema.parse(row.original)
      setCurrentRow(product)
      setOpen('update')
    } catch (error) {
      console.error('Lỗi xử lý dữ liệu:', error)
      toast.error('Invalid product data')
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <Button
        className='h-8 w-8 bg-blue-600 p-0 hover:bg-gray-500'
        onClick={handleViewClick}
        aria-label='View product'
      >
        <IconEye stroke={3.5} />
      </Button>
      <Button
        className='h-8 w-8 bg-yellow-500 p-0 hover:bg-gray-500'
        onClick={handleUpdateClick}
        aria-label='Edit product'
      >
        <IconPencil stroke={3.5} />
      </Button>
    </div>
  )
}
