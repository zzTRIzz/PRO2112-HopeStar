import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { BeatLoader } from 'react-spinners'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { getBatteryActive } from '../../attribute/battery/data/api-service'
import { getBluetoothActive } from '../../attribute/bluetooth/data/api-service'
import { getBrandActive } from '../../attribute/brand/data/api-service'
import { getCardActive } from '../../attribute/card/data/api-service'
import { getCategoryActive } from '../../attribute/category/data/api-service'
import { getChipActive } from '../../attribute/chip/data/api-service'
import { getColorActive } from '../../attribute/color/data/api-service'
import { getFrontCameraActive } from '../../attribute/front-camera/data/api-service'
import { getOsActive } from '../../attribute/os/data/api-service'
import { getRamActive } from '../../attribute/ram/data/api-service'
import { getRearCameraActive } from '../../attribute/rear-camera/data/api-service'
import { getRomActive } from '../../attribute/rom/data/api-service'
import { getScreenActive } from '../../attribute/screen/data/api-service'
import { getSimActive } from '../../attribute/sim/data/api-service'
import { getWifiActive } from '../../attribute/wifi/data/api-service'
import { createProduct } from '.././data/api-service'
import {
  ProductConfigRequest,
  productConfigRequestSchema,
  ProductImeiRequest,
} from '.././data/schema'
import { ProductDetailForm } from './components/product-detail-form'
import { ProductForm } from './components/product-form'

const useFetchData = () => {
  const { data } = useQuery({
    queryKey: ['productAttributes'],
    queryFn: async () => {
      const [
        batteries,
        bluetooths,
        brands,
        cards,
        categories,
        chips,
        colors,
        frontCameras,
        os,
        rams,
        rearCameras,
        roms,
        screens,
        sims,
        wifis,
      ] = await Promise.all([
        getBatteryActive(),
        getBluetoothActive(),
        getBrandActive(),
        getCardActive(),
        getCategoryActive(),
        getChipActive(),
        getColorActive(),
        getFrontCameraActive(),
        getOsActive(),
        getRamActive(),
        getRearCameraActive(),
        getRomActive(),
        getScreenActive(),
        getSimActive(),
        getWifiActive(),
      ])

      return {
        batteries,
        bluetooths,
        brands,
        cards,
        categories,
        chips,
        colors,
        frontCameras,
        os,
        rams,
        rearCameras,
        roms,
        screens,
        sims,
        wifis,
      }
    },
  })

  return (
    data || {
      batteries: [],
      bluetooths: [],
      brands: [],
      cards: [],
      categories: [],
      chips: [],
      colors: [],
      frontCameras: [],
      os: [],
      rams: [],
      rearCameras: [],
      roms: [],
      screens: [],
      sims: [],
      wifis: [],
    }
  )
}

export default function CreateProduct() {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  const [tableRows, setTableRows] = useState<
    {
      idRam: number
      idRom: number
      idColor: number
      price: number
      inventoryQuantity?: number
      productImeiRequests?: ProductImeiRequest[]
      imageUrl: string
    }[]
  >([])

  const navigate = useNavigate()

  const {
    batteries,
    bluetooths,
    brands,
    cards,
    categories,
    chips,
    colors,
    frontCameras,
    os,
    rams,
    rearCameras,
    roms,
    screens,
    sims,
    wifis,
  } = useFetchData()

  const form = useForm<ProductConfigRequest>({
    resolver: zodResolver(productConfigRequestSchema),
    defaultValues: {
      productRequest: {
        name: '',
        description: '',
        weight: 0,
        idChip: undefined,
        idBrand: undefined,
        idScreen: undefined,
        idCard: undefined,
        idOs: undefined,
        idWifi: undefined,
        idBluetooth: undefined,
        nfc: false,
        idBattery: undefined,
        chargerType: '',
        content: '',
        frontCamera: [],
        rearCamera: [],
        category: [],
        sim: [],
      },
      productDetailRequests: [
        {
          priceSell: 0,
          inventoryQuantity: 0,
          idRam: undefined,
          idRom: undefined,
          idColor: undefined,
          productImeiRequests: [],
          imageUrl: '',
        },
      ],
    },
  })

  useEffect(() => {
    if (tableRows.length > 0) {
      // Cập nhật productDetailRequests trong form
      form.setValue(
        'productDetailRequests',
        tableRows.map((row) => ({
          priceSell: row.price,
          inventoryQuantity: row.inventoryQuantity || 0,
          idRam: row.idRam,
          idRom: row.idRom,
          idColor: row.idColor,
          productImeiRequests: row.productImeiRequests || [],
          imageUrl: row.imageUrl || '',
        }))
      )
    }
  }, [tableRows, form.setValue])

  const onSubmit = useCallback(
    async (data: ProductConfigRequest) => {
      console.log('Form submitted!')
      console.log('Form data:', data)
      console.log('Table rows:', tableRows)

      // Xử lý dữ liệu từ bảng
      const processedData = {
        ...data,
        productDetailRequests: tableRows.map((row) => ({
          priceSell: row.price,
          inventoryQuantity: row.inventoryQuantity || 0,
          idRam: row.idRam,
          idRom: row.idRom,
          idColor: row.idColor,
          productImeiRequests: row.productImeiRequests || [],
          imageUrl: row.imageUrl || '',
        })),
      }

      form.reset(processedData)
      setIsLoading(true) // Bật trạng thái loading

      try {
        await createProduct(processedData)
        await queryClient.invalidateQueries({ queryKey: ['products'] })
        toast({
          title: 'Success',
          description: 'Product created successfully',
          className: 'bg-white',
        })
        navigate({ to: '/product' })
      } catch (error: any) {
        console.error('Error:', error)
        const errorMessage =
          error.response?.data?.message || 'Failed to create product'
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false) // Tắt trạng thái loading dù thành công hay thất bại
      }
    },
    [queryClient, navigate, tableRows, form.formState.errors]
  )

  return (
    <div className='h-full'>
      <div className='mx-auto w-11/12 py-4 pt-10'>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              console.log('Form submit event triggered')
              console.log('Validation errors:', form.formState.errors)
              console.log('Table rows:', tableRows)
              form.handleSubmit(onSubmit)(e)
            }}
            className='space-y-4'
          >
            <ProductForm
              control={form.control}
              batteries={batteries}
              bluetooths={bluetooths}
              brands={brands}
              cards={cards}
              categories={categories}
              chips={chips}
              frontCameras={frontCameras}
              os={os}
              rearCameras={rearCameras}
              screens={screens}
              sims={sims}
              wifis={wifis}
            />

            <FormProvider {...form}>
              <ProductDetailForm
                rams={rams}
                roms={roms}
                colors={colors}
                onTableRowsChange={setTableRows}
              />
            </FormProvider>

            <div className='flex justify-end gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => navigate({ to: '/product' })}
                disabled={isLoading} // Vô hiệu hóa nút Cancel khi đang loading
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
