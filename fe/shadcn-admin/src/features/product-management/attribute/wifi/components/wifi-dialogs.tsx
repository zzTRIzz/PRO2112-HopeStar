import { useTasks } from '../context/wifis-context'
import { WifiMutateDialog } from './wifi-mutate-dialog'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTasks()
  return (
    <>
      <WifiMutateDialog
        key='wifi-create'
        open={open === 'create'}
        onOpenChange={(value) => {
          setOpen(value ? 'create' : null)
          if (!value) setCurrentRow(null)
        }}
      />
      {currentRow && (
        <>
          <WifiMutateDialog
            key={`wifi-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={(value) => {
              setOpen(value ? 'update' : null)
              if (!value) setCurrentRow(null)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
