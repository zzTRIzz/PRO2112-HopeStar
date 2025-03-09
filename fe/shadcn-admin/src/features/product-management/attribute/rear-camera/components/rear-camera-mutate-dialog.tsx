import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import { RearCamera, rearCameraSchema } from '../data/schema'
import { useRearCameraMutation } from '../hooks/use-rear-camera-mutation'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: RearCamera
}

export function RearCameraMutateDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const queryClient = useQueryClient()
  const isUpdate = !!currentRow
  const { mutate, isPending } = useRearCameraMutation(isUpdate)

  const form = useForm<RearCamera>({
    resolver: zodResolver(rearCameraSchema.omit({ id: true })),
    defaultValues: currentRow || {
      type: '',
      resolution: 0,
      status: '',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        type: currentRow.type,
        resolution: currentRow.resolution,
        status: currentRow.status,
      })
    }
  }, [currentRow, form.reset])

  const onSubmit = (data: Omit<RearCamera, 'id'>) => {
    const submitData = isUpdate ? { ...data, id: currentRow?.id } : data

    mutate(submitData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['rearCameras'] })
        onOpenChange(false)
        form.reset()
        toast({
          title: 'Success',
          description: `${isUpdate ? 'Updated' : 'Created'} successfully`,
          className: 'fixed top-4 right-4 md:max-w-[300px] bg-white',
          duration: 2000,
        })
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description:
            error.message || `Failed to ${isUpdate ? 'update' : 'create'}`,
          variant: 'destructive',
          className: 'fixed top-4 right-4 md:max-w-[300px]',
          duration: 2000,
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Update' : 'Create'} Rear Camera
          </DialogTitle>
          <DialogDescription>
            {isUpdate
              ? 'Update the rearCamera by providing necessary info.'
              : 'Add a new rearCamera by providing necessary info.'}
            Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='rearCamera-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter camera type' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='resolution'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resolution (MP)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder='Enter resolution'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select status'
                    items={[
                      { label: 'Active', value: 'ACTIVE' },
                      { label: 'Inactive', value: 'IN_ACTIVE' },
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button form='rearCamera-form' type='submit' disabled={isPending}>
            {isPending ? 'Saving...' : `${isUpdate ? 'Update' : 'Save'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
