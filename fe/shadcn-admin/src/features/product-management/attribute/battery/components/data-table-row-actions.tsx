import { Row } from '@tanstack/react-table'
import { IconClipboardText } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useTasks } from '../context/batteries-context'
import { batterySchema } from '../data/schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const battery = batterySchema.parse(row.original)

  const { setOpen, setCurrentRow } = useTasks()

  return (
    <div>
      <Button
        onClick={() => {
          setCurrentRow(battery)
          setOpen('update')
        }}
      >
        <IconClipboardText stroke={2} />
      </Button>
    </div>
  )
}
