import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { IconLoader2, IconQuestionMark } from '@tabler/icons-react'
import { Route } from '@/routes/_authenticated/route'
import { toast } from '@/hooks/use-toast'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Breadcrumb } from '../breadcrumb'
import { productDetailById } from '../product/data/api-service'
import { DataTable } from './components/data-table'
import { ImeiDialog } from './components/imei-dialog'
import { ProductDetailDialogs } from './components/product-detail-dialogs'
import { ProductDetailPrimaryButtons } from './components/product-detail-primary-buttons'
import { StatusSwitch } from './components/status-switch'
import { DialogProvider, useDialog } from './context/dialog-context'
import { ProductDetailResponse } from './data/schema'

const columns: ColumnDef<ProductDetailResponse>[] = [
  {
    accessorKey: 'id',
    header: 'STT',
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: 'code',
    header: 'Mã',
  },
  {
    accessorKey: 'imageUrl',
    header: 'Hình ảnh',
    cell: ({ row }) => (
      <div className='h-20 w-16'>
        {row.original.imageUrl ? (
          <img
            src={row.original.imageUrl}
            alt={`${row.original.colorName}`}
            className='h-full w-full rounded-sm object-cover'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center rounded-lg bg-muted'>
            <IconQuestionMark className='h-6 w-6' />
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'ramCapacity',
    header: 'RAM',
    cell: ({ row }) => <div>{row.original.ramCapacity}</div>,
  },
  {
    accessorKey: 'romCapacity',
    header: 'ROM',
    cell: ({ row }) => <div>{row.original.romCapacity}</div>,
  },
  {
    accessorKey: 'colorName',
    header: 'Màu sắc',
  },
  {
    accessorKey: 'priceSell',
    header: 'Giá bán',
    cell: ({ row }) => <div>{row.original.priceSell.toLocaleString()}đ</div>,
  },
  {
    accessorKey: 'inventoryQuantity',
    header: 'Số lượng tồn',
    cell: ({ row }) => {
      const { setOpen } = useDialog()
      const productDetail = row.original

      return (
        <div
          onClick={() => setOpen({ type: 'imei', data: productDetail })}
          className='group flex cursor-pointer items-center gap-1 hover:text-primary'
        >
          <span className='underline decoration-dotted group-hover:decoration-solid'>
            {productDetail.inventoryQuantity}
          </span>
          <span className='text-muted-foreground'>
            ({productDetail.productImeiResponses.length} IMEI)
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const productDetail = row.original as ProductDetailResponse
      return <StatusSwitch productDetail={productDetail} />
    },
  },
]

export default function ProductDetail() {
  const { id } = Route.useParams()

  // Sử dụng useQuery để fetch dữ liệu
  const {
    data: productDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['product-details', id], // Query key với id sản phẩm
    queryFn: () => productDetailById(Number(id)),
  })

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <IconLoader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  if (isError) {
    toast({
      title: 'Lỗi',
      description:
        error?.message || 'Không thể tải thông tin chi tiết sản phẩm',
      variant: 'destructive',
    })
    return (
      <div className='flex h-full items-center justify-center text-red-500'>
        Đã xảy ra lỗi khi tải dữ liệu
      </div>
    )
  }

  return (
    <DialogProvider>
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
                    href: '/product',
                  },
                  {
                    label: 'Sản phẩm chi tiết',
                  },
                ]}
              />
            </div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Chi tiết sản phẩm
            </h2>
            <p className='text-muted-foreground'>
              Danh sách các phiên bản của sản phẩm
            </p>
          </div>
          <ProductDetailPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <DataTable columns={columns} data={productDetails || []} />
        </div>
      </Main>

      <ImeiDialog />
      <ProductDetailDialogs />
    </DialogProvider>
  )
}
