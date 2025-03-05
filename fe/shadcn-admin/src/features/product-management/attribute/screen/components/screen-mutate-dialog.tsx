import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient, useQuery } from '@tanstack/react-query'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SelectDropdown } from '@/components/select-dropdown'
import { getResolution } from '../../resolution/data/api-service'
import { Screen, screenSchema } from '../data/schema'
import { useScreenMutation } from '../hooks/use-screen-mutation'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Screen
}

export function ScreenMutateDialog({ open, onOpenChange, currentRow }: Props) {
  const queryClient = useQueryClient()
  const isUpdate = !!currentRow
  const { mutate, isPending } = useScreenMutation(isUpdate)

  // Add this query to fetch resolutions
  const { data: resolutions } = useQuery({
    queryKey: ['resolutions'],
    queryFn: getResolution,
  })

  const form = useForm<Screen>({
    resolver: zodResolver(screenSchema.omit({ id: true })),
    defaultValues: currentRow || {
      type: '',
      displaySize: 0,
      resolution: {
        width: 0,
        height: 0,
        resolutionType: '',
      },
      status: '',
      refreshRate: 0,
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        type: currentRow.type,
        displaySize: currentRow.displaySize,
        resolution: currentRow.resolution,
        status: currentRow.status,
        refreshRate: currentRow.refreshRate,
      })
    }
  }, [currentRow, form.reset])

  const onSubmit = (data: Omit<Screen, 'id'>) => {
    const submitData = isUpdate ? { ...data, id: currentRow?.id } : data

    mutate(submitData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['screens'] })
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
          <DialogTitle>{isUpdate ? 'Update' : 'Create'} Screen</DialogTitle>
          <DialogDescription>
            {isUpdate
              ? 'Update the screen by providing necessary info.'
              : 'Add a new screen by providing necessary info.'}
            Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='screen-form'
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
                    <Input {...field} placeholder='Enter a type' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='displaySize'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Size (inches)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.1'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder='Enter display size'
                    />
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
                  <FormLabel>Resolution</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const resolution = JSON.parse(value)
                      field.onChange(resolution)
                    }}
                    value={
                      field.value ? JSON.stringify(field.value) : undefined
                    }
                    defaultValue={
                      field.value ? JSON.stringify(field.value) : undefined
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select resolution'>
                        {field.value &&
                          `${field.value.width}x${field.value.height} (${field.value.resolutionType})`}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {resolutions?.map((resolution) => (
                        <SelectItem
                          key={resolution.id}
                          value={JSON.stringify(resolution)}
                        >
                          {`${resolution.width}x${resolution.height} (${resolution.resolutionType})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='refreshRate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Refresh Rate (Hz)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder='Enter refresh rate'
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
          <Button form='screen-form' type='submit' disabled={isPending}>
            {isPending ? 'Saving...' : `${isUpdate ? 'Update' : 'Save'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
