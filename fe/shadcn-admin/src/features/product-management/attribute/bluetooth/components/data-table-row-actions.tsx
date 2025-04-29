import { Row } from '@tanstack/react-table'
import { IconClipboardText } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useTasks } from '../context/bluetooths-context'
import { bluetoothSchema } from '../data/schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const bluetooth = bluetoothSchema.parse(row.original)

  const { setOpen, setCurrentRow } = useTasks()

  return (
    <div>
      <Button
        onClick={() => {
          setCurrentRow(bluetooth)
          setOpen('update')
        }}
      >
        <IconClipboardText stroke={2} />
      </Button>
    </div>
  )
}
