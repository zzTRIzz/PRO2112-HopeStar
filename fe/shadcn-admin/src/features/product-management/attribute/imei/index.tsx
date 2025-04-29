import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import ImeisProvider from './context/imeis-context'
import type { ImeiResponse } from './data/schema'
import { StatusImei } from './data/schema'
import { getImei } from './data/api-service'
import { IconLoader2 } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
const columns: ColumnDef<ImeiResponse>[] = [
  {
    accessorKey: 'id',
    header: 'STT',
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>
    },
  },
  {
    accessorKey: 'productName',
    header: 'Tên sản phẩm',
  },
  {
    accessorKey: 'imeiCode',
    header: 'Mã IMEI',
  },
  {
    accessorKey: 'barCode',
    header: 'Mã vạch',
    cell: ({ row }) => (
      <div className='h-10 w-full'>
        {row.original.barCode ? (
          <img
            src={row.original.barCode}
            className='h-full w-full rounded-lg object-cover'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center rounded-lg bg-muted'>
            Không có ảnh
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge
          variant={
            status === StatusImei.NOT_SOLD
              ? 'default'
              : status === StatusImei.IN_ACTIVE
                ? 'secondary'
                : status === StatusImei.PENDING_DELIVERY
                  ? 'outline'
                  : status === StatusImei.IN_THE_CART
                    ? 'warning'
                    : status === StatusImei.CANCELLED
                      ? 'destructive'
                      : 'success'
          }
        >
          {status === StatusImei.NOT_SOLD
            ? 'Chưa bán'
            : status === StatusImei.IN_ACTIVE
              ? 'Không hoạt động'
              : status === StatusImei.PENDING_DELIVERY
                ? 'Chờ giao hàng'
                : status === StatusImei.IN_THE_CART
                  ? 'Trong giỏ hàng'
                  : status === StatusImei.CANCELLED
                    ? 'Đã hủy'
                    : 'Đã bán'}
        </Badge>
      )
    },
  },
]

export default function ImeiManagement() {
  // Add useQuery hook to fetch IMEI data
  const {
    data: imeis,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['imeis'],
    queryFn: getImei,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 0,
    refetchInterval: false,
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
      description: error?.message || 'Không thể tải thông tin IMEI',
      variant: 'destructive',
    })
    return (
      <div className='flex h-full items-center justify-center text-red-500'>
        Đã xảy ra lỗi khi tải dữ liệu
      </div>
    )
  }

  return (
    <ImeisProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Quản lý IMEI</h2>
            <p className='text-muted-foreground'>
              Danh sách mã IMEI của tất cả sản phẩm
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable columns={columns} data={imeis || []} />
        </div>
      </Main>
    </ImeisProvider>
  )
}
