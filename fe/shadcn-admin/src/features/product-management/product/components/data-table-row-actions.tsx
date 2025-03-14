import { Row } from '@tanstack/react-table'
import { IconEye, IconPencil } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useTasks } from '../context/tasks-context'
import { productResponseSchema } from '../data/schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const product = productResponseSchema.parse(row.original)
  const { setOpen, setCurrentRow } = useTasks()

  return (
    <div className='flex items-center gap-2'>
      <Button
        className='h-8 w-8 p-0 hover:bg-gray-500'
        onClick={() => {
          setCurrentRow(product)
          setOpen('update')
        }}
      >
        <IconPencil stroke={3.5} />
      </Button>
      <Button
        className='h-8 w-8 p-0 hover:bg-gray-500'
        onClick={() => {
          setCurrentRow(product)
          setOpen('display')
        }}
      >
        <IconEye stroke={3.5} />
      </Button>
    </div>
  )
}
