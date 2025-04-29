import { Row } from '@tanstack/react-table'
import { IconClipboardText } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useTasks } from '../context/screens-context'
import { screenSchema } from '../data/schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const screen = screenSchema.parse(row.original)

  const { setOpen, setCurrentRow } = useTasks()

  return (
    <div>
      <Button
        onClick={() => {
          setCurrentRow(screen)
          setOpen('update')
        }}
      >
        <IconClipboardText stroke={2} />
      </Button>
    </div>
  )
}
