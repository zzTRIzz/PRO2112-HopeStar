import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { IconLoader2 } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Breadcrumb } from '../breadcrumb'
import { DataTable } from './components/data-table'
import { ProductDialogs } from './components/product-dialogs'
import { ProductPrimaryButtons } from './components/product-primary-buttons'
import { StatusSwitch } from './components/status-switch'
import ProductProvider from './context/product-context'
import {
  getProducts,
  productDetailById,
  searchProducts,
} from './data/api-service'
import type { ProductResponse, SearchProductRequest } from './data/schema'

const columns: ColumnDef<ProductResponse>[] = [
  {
    accessorKey: 'id',
    header: 'STT',
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>
    },
  },
  {
    accessorKey: 'code',
    header: 'Mã',
  },
  {
    accessorKey: 'name',
    header: 'Tên sản phẩm',
  },
  {
    accessorKey: 'totalNumber',
    header: 'Tổng số lượng',
    cell: ({ row }) => {
      const product = row.original as ProductResponse
      const navigate = useNavigate()

      const handleClick = async () => {
        try {
          await productDetailById(product.id)
          navigate({
            to: '/product/$id/product-detail',
            params: { id: product.id },
          })
        } catch (error) {
          toast({
            title: 'Lỗi',
            description: 'Không thể tải chi tiết sản phẩm',
            variant: 'destructive',
          })
        }
      }

      return (
        <div
          className='group flex cursor-pointer items-center gap-1 hover:text-primary'
          onClick={handleClick}
        >
          <span className='underline decoration-dotted group-hover:decoration-solid'>
            {product.totalNumber}
          </span>
          <span className='text-muted-foreground underline decoration-dotted group-hover:decoration-solid'>
            ({product.totalVersion} phiên bản)
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const product = row.original as ProductResponse
      return <StatusSwitch product={product} />
    },
  },
]

export default function Product() {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // State cho các filter
  const [searchValue, setSearchValue] = useState('')
  const [idChip, setIdChip] = useState<number | undefined>(undefined)
  const [idBrand, setIdBrand] = useState<number | undefined>(undefined)
  const [idScreen, setIdScreen] = useState<number | undefined>(undefined)
  const [idCard, setIdCard] = useState<number | undefined>(undefined)
  const [idOs, setIdOs] = useState<number | undefined>(undefined)
  const [idWifi, setIdWifi] = useState<number | undefined>(undefined)
  const [idBluetooth, setIdBluetooth] = useState<number | undefined>(undefined)
  const [idBattery, setIdBattery] = useState<number | undefined>(undefined)
  const [idCategory, setIdCategory] = useState<number | undefined>(undefined)
  const [status, setStatus] = useState<string | undefined>(undefined)

  // Sử dụng useQuery để fetch dữ liệu ban đầu
  const { data: initialData, isError: isQueryError, error: queryError } = useQuery({
    queryKey: ['products', 'initial'],
    queryFn: getProducts,
    refetchOnWindowFocus: false
  })

  // Cập nhật state khi dữ liệu từ useQuery thay đổi
  useEffect(() => {
    if (initialData) {
      setProducts(initialData)
      setLoading(false)
    }
    if (isQueryError && queryError) {
      setError(queryError)
      setLoading(false)
    }
  }, [initialData, isQueryError, queryError])

  // Gọi API searchProducts khi có thay đổi trong filter
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Nếu không có giá trị tìm kiếm hoặc filter, gọi getProducts
        if (
          !searchValue &&
          !idChip &&
          !idBrand &&
          !idScreen &&
          !idCard &&
          !idOs &&
          !idWifi &&
          !idBluetooth &&
          !idBattery &&
          !idCategory &&
          !status
        ) {
          const data = await getProducts()
          setProducts(data)
          return
        }

        // Nếu có giá trị tìm kiếm hoặc filter, gọi searchProducts
        const searchProductRequest: SearchProductRequest = {
          key: searchValue,
          idChip,
          idBrand,
          idScreen,
          idCard,
          idOs,
          idWifi,
          idBluetooth,
          idBattery,
          idCategory,
          status,
        }
        const data = await searchProducts(searchProductRequest)
        setProducts(data)
      } catch (error) {
        setError(error as Error)
      }
    }

    fetchData()
  }, [
    searchValue,
    idChip,
    idBrand,
    idScreen,
    idCard,
    idOs,
    idWifi,
    idBluetooth,
    idBattery,
    idCategory,
    status,
  ])

  // Chỉ hiển thị loading khi chưa có dữ liệu và đang loading
  if (loading && products.length === 0) {
    return (
      <div className='flex h-full items-center justify-center'>
        <IconLoader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='mt-9 flex h-screen items-center justify-center text-2xl'>
        Lỗi: {error.message}
      </div>
    )
  }

  return (
    <ProductProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <div className='flex items-center pb-1'>
              <Breadcrumb
                items={[
                  {
                    label: 'Sản phẩm',
                  },
                ]}
              />
            </div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Sản phẩm
            </h2>
            <p className='text-muted-foreground'>
              Danh sách sản phẩm của bạn trong hệ thống
            </p>
          </div>
          <ProductPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={products}
            columns={columns}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            idChip={idChip}
            setIdChip={setIdChip}
            idBrand={idBrand}
            setIdBrand={setIdBrand}
            idScreen={idScreen}
            setIdScreen={setIdScreen}
            idCard={idCard}
            setIdCard={setIdCard}
            idOs={idOs}
            setIdOs={setIdOs}
            idWifi={idWifi}
            setIdWifi={setIdWifi}
            idBluetooth={idBluetooth}
            setIdBluetooth={setIdBluetooth}
            idBattery={idBattery}
            setIdBattery={setIdBattery}
            idCategory={idCategory}
            setIdCategory={setIdCategory}
            status={status}
            setStatus={setStatus}
          />
        </div>
      </Main>

      <ProductDialogs />
    </ProductProvider>
  )
}