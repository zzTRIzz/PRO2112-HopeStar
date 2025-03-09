import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import { Product, productSchema } from './data/schema'

export default function CreateProduct() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const form = useForm<Product>({
    resolver: zodResolver(productSchema.omit({ id: true })),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      weight: 0,
      nameChip: '',
      nameBrand: '',
      typeScreen: '',
      typeCard: '',
      nameOs: '',
      nameWifi: '',
      nameBluetooth: '',
      frontCamera: [],
      rearCamera: [],
      category: [],
      nfc: false,
      typeBattery: '',
      chargerType: '',
      status: '',
      content: '',
      totalNumber: 0,
      totalVersion: 0,
    },
  })

  const onSubmit = async (data: Product) => {
    try {
      // API call here
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: 'Success',
        description: 'Product created successfully',
        className: 'bg-white',
      })
      navigate('/products')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className='container mx-auto py-10'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Basic Information */}
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Code</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter product code' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter product name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='weight'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (g)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter weight'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Specifications */}
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='nameChip'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chip</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter chip name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='nameBrand'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter brand name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='typeScreen'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Screen Type</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter screen type' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Connectivity */}
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='nameWifi'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WiFi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter WiFi specification'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='nameBluetooth'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bluetooth</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter Bluetooth version' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='nfc'
                render={({ field }) => (
                  <FormItem className='flex items-center justify-between'>
                    <FormLabel>NFC Support</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Features */}
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='typeBattery'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Battery Type</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter battery type' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='chargerType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Charger Type</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter charger type' {...field} />
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
            </div>
          </div>

          {/* Description and Content */}
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter product description'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter product content'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex justify-end gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate('/products')}
            >
              Cancel
            </Button>
            <Button type='submit'>Create Product</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
