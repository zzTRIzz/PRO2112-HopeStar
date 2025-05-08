import { DialogDescription } from '@radix-ui/react-dialog'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { ColumnDef } from '@tanstack/react-table'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDialog } from '../context/dialog-context'
import { ProductImeiResponse } from '../data/schema'
import { DataTable } from './data-table'
import { Badge } from '@/components/ui/badge'

const columns: ColumnDef<ProductImeiResponse>[] = [
  {
    accessorKey: 'id',
    header: 'STT',
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: 'code',
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
    accessorKey: 'statusImei',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.original.statusImei
      return (
        <Badge
          variant={
            status === 'NOT_SOLD'
              ? 'default'
              : status === 'IN_ACTIVE'
                ? 'destructive'
                      : 'success'
          }
        >
          {status === 'NOT_SOLD'
            ? 'Chưa bán'
            : status === 'IN_ACTIVE'
              ? 'Không hoạt động'
                    : 'Đã bán'}
        </Badge>
      )
    },
  },
]

export function ImeiDialog() {
  const { open, setOpen } = useDialog()

  // Return null if dialog shouldn't be shown
  if (!open || open.type !== 'imei' || !open.data) return null

  const productDetail = open.data

  return (
    <Dialog open={true} onOpenChange={() => setOpen(null)}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>
            Chi tiết IMEI - {productDetail.colorName} (
            {productDetail.ramCapacity}/
            {productDetail.romCapacity})
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết tất cả các IMEI
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='h-[400px] pr-4'>
          <DataTable
            columns={columns}
            data={productDetail.productImeiResponses}
            hideActions={true}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ImeiDialog
