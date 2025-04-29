import { useTasks } from '../context/categories-context'
import { CategoryMutateDialog } from './category-mutate-dialog'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTasks()
  return (
    <>
      <CategoryMutateDialog
        key='category-create'
        open={open === 'create'}
        onOpenChange={(value) => {
          setOpen(value ? 'create' : null)
          if (!value) setCurrentRow(null)
        }}
      />
      {currentRow && (
        <>
          <CategoryMutateDialog
            key={`category-update-${currentRow.id}`}
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
