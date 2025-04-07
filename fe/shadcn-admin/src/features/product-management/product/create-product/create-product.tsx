import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import {
  createProduct,
  getBatteryActive,
  getBluetoothActive,
  getBrandActive,
  getCardActive,
  getCategoryActive,
  getChipActive,
  getColorActive,
  getFrontCameraActive,
  getOsActive,
  getRamActive,
  getRearCameraActive,
  getRomActive,
  getScreenActive,
  getSimActive,
  getWifiActive,
} from '.././data/api-service'
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
        idChip: 0,
        idBrand: 0,
        idScreen: 0,
        idCard: 0,
        idOs: 0,
        idWifi: 0,
        idBluetooth: 0,
        nfc: false,
        idBattery: 0,
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
      console.log('TableRows được cập nhật:', tableRows)
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

      // Kiểm tra IMEI trùng lặp
      const allImeis = tableRows.reduce((acc: string[], row) => {
        const imeis =
          row.productImeiRequests?.map((imei) => imei.imeiCode) || []
        return [...acc, ...imeis]
      }, [])

      // Tìm các IMEI trùng lặp
      const duplicateMap = allImeis.reduce(
        (acc: { [key: string]: number }, imei) => {
          acc[imei] = (acc[imei] || 0) + 1
          return acc
        },
        {}
      )

      const duplicateImeis = Object.entries(duplicateMap)
        .filter(([_, count]) => count > 1)
        .map(([imei]) => imei)

      if (duplicateImeis.length > 0) {
        toast({
          title: 'Lỗi',
          description: `Phát hiện IMEI trùng lặp: ${duplicateImeis.join(', ')}`,
          variant: 'destructive',
        })
        return
      }
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

      setIsLoading(true)

      try {
        await createProduct(processedData)
        await queryClient.invalidateQueries({ queryKey: ['products'] })
        toast({
          title: 'Thành công',
          description: 'Tạo sản phẩm thành công',
          className: 'bg-white',
        })
        navigate({ to: '/product' })
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Lỗi khi tạo sản phẩm'
        toast({
          title: 'Lỗi',
          description: errorMessage,
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [queryClient, navigate, tableRows, form.formState.errors]
  )

  return (
    <div className='h-full'>
      <div className='mx-auto w-11/12 py-4 pt-2'>
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
                Hủy
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Đang lưu...' : 'Lưu thông tin'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
