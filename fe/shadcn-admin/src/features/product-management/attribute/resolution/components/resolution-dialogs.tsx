import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useTasks } from '../context/resolutions-context'
import { ResolutionMutateDialog } from './resolution-mutate-dialog'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTasks()
  return (
    <>
      <ResolutionMutateDialog
        key='resolution-create'
        open={open === 'create'}
        onOpenChange={(value) => {
          setOpen(value ? 'create' : null)
          if (!value) setCurrentRow(null)
        }}
      />
      {currentRow && (
        <>
          <ResolutionMutateDialog
            key={`resolution-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={(value) => {
              setOpen(value ? 'update' : null)
              if (!value) setCurrentRow(null)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='resolution-delete'
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
                title: 'The following resolution has been deleted:',
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
            title={`Delete this resolution: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a resolution with the ID{' '}
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
