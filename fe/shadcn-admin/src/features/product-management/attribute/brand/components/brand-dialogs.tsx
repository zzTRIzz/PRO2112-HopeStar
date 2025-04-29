import { useTasks } from '../context/brands-context'
import { BrandMutateDialog } from './brand-mutate-dialog'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTasks()
  return (
    <>
      <BrandMutateDialog
        key='brand-create'
        open={open === 'create'}
        onOpenChange={(value) => {
          setOpen(value ? 'create' : null)
          if (!value) setCurrentRow(null)
        }}
      />
      {currentRow && (
        <>
          <BrandMutateDialog
            key={`brand-update-${currentRow.id}`}
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
