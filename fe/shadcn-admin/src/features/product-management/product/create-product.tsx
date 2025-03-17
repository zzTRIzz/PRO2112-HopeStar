import { useCallback, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { BeatLoader } from 'react-spinners'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { getBatteryActive } from '../attribute/battery/data/api-service'
import { getBluetoothActive } from '../attribute/bluetooth/data/api-service'
import { getBrandActive } from '../attribute/brand/data/api-service'
import { getCardActive } from '../attribute/card/data/api-service'
import { getCategoryActive } from '../attribute/category/data/api-service'
import { getChipActive } from '../attribute/chip/data/api-service'
import { getColorActive } from '../attribute/color/data/api-service'
import { getFrontCameraActive } from '../attribute/front-camera/data/api-service'
import { getOsActive } from '../attribute/os/data/api-service'
import { getRamActive } from '../attribute/ram/data/api-service'
import { getRearCameraActive } from '../attribute/rear-camera/data/api-service'
import { getRomActive } from '../attribute/rom/data/api-service'
import { getScreenActive } from '../attribute/screen/data/api-service'
import { getSimActive } from '../attribute/sim/data/api-service'
import { getWifiActive } from '../attribute/wifi/data/api-service'
import { createProduct } from './data/api-service'
import { ProductConfigRequest, productConfigRequestSchema } from './data/schema'
import { ProductDetailForm } from './product-detail-form'
import { ProductForm } from './product-form'

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
    { ramId: number; romId: number; colorId: number }[]
  >([]) // Thêm state để lưu trữ `tableRows`
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

  const onSubmit = useCallback(
    async (data: ProductConfigRequest) => {
      setIsLoading(true) // Bật trạng thái loading
      try {
        // Xử lý dữ liệu từ bảng
        const processedData = {
          ...data,
          productDetailRequests: tableRows.map((row) => ({
            priceSell: 0, // Giá trị mặc định
            inventoryQuantity: 0, // Giá trị mặc định
            idRam: row.ramId,
            idRom: row.romId,
            idColor: row.colorId,
            productImeiRequests: [], // Giá trị mặc định
            imageUrl: '', // Giá trị mặc định
          })),
        }

        await createProduct(processedData)
        await queryClient.invalidateQueries({ queryKey: ['products'] })
        toast({
          title: 'Success',
          description: 'Product created successfully',
          className: 'bg-white',
        })
        navigate({ to: '/product' })
      } catch (error: any) {
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
    [queryClient, navigate, tableRows]
  )

  return (
    <div className='h-full'>
      <div className='mx-auto w-11/12 py-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* <ProductForm
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
            /> */}

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
                {isLoading ? (
                  <div className='flex items-center gap-2'>
                    <BeatLoader size={8} color='#ffffff' /> {/* Spinner */}
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Product'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
