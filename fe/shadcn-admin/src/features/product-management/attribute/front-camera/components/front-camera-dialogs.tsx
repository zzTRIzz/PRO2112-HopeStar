import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useTasks } from '../context/front-cameras-context'
import { FrontCameraMutateDialog } from './front-camera-mutate-dialog'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTasks()
  return (
    <>
      <FrontCameraMutateDialog
        key='frontCamera-create'
        open={open === 'create'}
        onOpenChange={(value) => {
          setOpen(value ? 'create' : null)
          if (!value) setCurrentRow(null)
        }}
      />
      {currentRow && (
        <>
          <FrontCameraMutateDialog
            key={`frontCamera-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={(value) => {
              setOpen(value ? 'update' : null)
              if (!value) setCurrentRow(null)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='frontCamera-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              toast({
                title: 'The following frontCamera has been deleted:',
                description: (
                  <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                    <code className='text-white'>
                      {JSON.stringify(currentRow, null, 2)}
                    </code>
                  </pre>
                ),
              })
            }}
            className='max-w-md'
            title={`Delete this frontCamera: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a frontCamera with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
