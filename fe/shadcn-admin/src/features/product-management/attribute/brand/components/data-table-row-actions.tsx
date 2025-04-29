import { Row } from '@tanstack/react-table'
import { IconClipboardText } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useTasks } from '../context/brands-context'
import { brandSchema } from '../data/schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const brand = brandSchema.parse(row.original)

  const { setOpen, setCurrentRow } = useTasks()

  return (
    <div>
      <Button
        onClick={() => {
          setCurrentRow(brand)
          setOpen('update')
        }}
      >
        <IconClipboardText stroke={2} />
      </Button>
    </div>
  )
}
