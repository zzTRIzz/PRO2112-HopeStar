import { Row } from '@tanstack/react-table'
import { IconClipboardText } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useTasks } from '../context/front-cameras-context'
import { frontCameraSchema } from '../data/schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const frontCamera = frontCameraSchema.parse(row.original)

  const { setOpen, setCurrentRow } = useTasks()

  return (
    <div>
      <Button
        onClick={() => {
          setCurrentRow(frontCamera)
          setOpen('update')
        }}
      >
        <IconClipboardText stroke={2} />
      </Button>
    </div>
  )
}
