import { Row } from '@tanstack/react-table'
import { IconClipboardText } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useImeis } from '../context/imeis-context'
import { imeiResponseSchema } from '../data/schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const imei = imeiResponseSchema.parse(row.original)

  const { setOpen, setCurrentRow } = useImeis()

  return (
    <div>
      <Button
        onClick={() => {
          setCurrentRow(imei)
          setOpen('update')
        }}
      >
        <IconClipboardText stroke={2} />
      </Button>
    </div>
  )
}
