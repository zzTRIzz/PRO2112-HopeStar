import { Row } from '@tanstack/react-table'
import { IconClipboardText } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <div>
      <Button>
        <IconClipboardText stroke={2} />
      </Button>
    </div>
  )
}
