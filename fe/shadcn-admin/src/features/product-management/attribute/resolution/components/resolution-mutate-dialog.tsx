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
import { Resolution, resolutionSchema } from '../data/schema'
import { useResolutionMutation } from '../hooks/use-resolution-mutation'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Resolution
}

export function ResolutionMutateDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const queryClient = useQueryClient()
  const isUpdate = !!currentRow
  const { mutate, isPending } = useResolutionMutation(isUpdate)

  const form = useForm<Resolution>({
    resolver: zodResolver(resolutionSchema.omit({ id: true })),
    defaultValues: currentRow || {
      width: 0,
      height: 0,
      resolutionType: '',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        width: currentRow.width,
        height: currentRow.height,
        resolutionType: currentRow.resolutionType,
      })
    } else {
      form.reset({
        width: 0,
        height: 0,
        resolutionType: '',
      })
    }
  }, [currentRow, form.reset])

  const onSubmit = async (data: Omit<Resolution, 'id'>) => {
    const submitData = isUpdate ? { ...data, id: currentRow?.id } : data

    mutate(submitData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['resolutions'],
          exact: true,
        })
        await queryClient.refetchQueries({
          queryKey: ['resolutions'],
          exact: true,
        })
        onOpenChange(false)
        form.reset({
          width: 0,
          height: 0,
          resolutionType: '',
        })
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
          <DialogTitle>{isUpdate ? 'Update' : 'Create'} Resolution</DialogTitle>
          <DialogDescription>
            {isUpdate
              ? 'Update the resolution by providing necessary info.'
              : 'Add a new resolution by providing necessary info.'}
            Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='resolution-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='resolutionType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resolution Type</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Example: HD, Full HD, 4K...'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='height'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (px)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder='Enter height'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='width'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width (px)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder='Enter width'
                    />
                  </FormControl>
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
          <Button form='resolution-form' type='submit' disabled={isPending}>
            {isPending ? 'Saving...' : `${isUpdate ? 'Update' : 'Save'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
