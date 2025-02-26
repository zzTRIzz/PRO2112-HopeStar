import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SelectDropdown } from '@/components/select-dropdown'
import { Brand } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Brand
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  status: z.string().min(1, 'Please select a status.'),
  code: z.string().min(1, 'Code is required.'),
})

type BrandForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow

  const form = useForm<BrandForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      name: '',
      status: '',
      code: '',
    },
  })

  const onSubmit = (data: BrandForm) => {
    // do something with the form data
    onOpenChange(false)
    form.reset()
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex w-full max-w-3xl flex-col'>
        <SheetHeader className='text-left'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Brand</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the brand by providing necessary info.'
              : 'Add a new brand by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='brand-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-5'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Status</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select dropdown'
                    items={[
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' },
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a code' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='brand-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
