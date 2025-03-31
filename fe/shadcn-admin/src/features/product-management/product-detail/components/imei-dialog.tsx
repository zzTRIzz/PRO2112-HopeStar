import React from 'react'
import { DialogDescription } from '@radix-ui/react-dialog'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDialog } from '../context/dialog-context'
import { ProductImeiResponse } from '../data/schema'
import { DataTable } from './data-table'

const columns: ColumnDef<ProductImeiResponse>[] = [
  {
    accessorKey: 'id',
    header: 'STT',
    cell: ({ row }) => <div>{row.index + 1}</div>,
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
    accessorKey: 'statusImei',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.original.statusImei
      return (
        <Badge
          variant={
            status === 'ACTIVE'
              ? 'default'
              : status === 'INACTIVE'
                ? 'secondary'
                : status === 'PENDING'
                  ? 'outline'
                  : 'destructive'
          }
        >
          {status === 'ACTIVE'
            ? 'Hoạt động'
            : status === 'INACTIVE'
              ? 'Không hoạt động'
              : status === 'PENDING'
                ? 'Chờ xử lý'
                : 'Đã bán'}
        </Badge>
      )
    },
  },
]

export function ImeiDialog() {
  const { open, setOpen } = useDialog()

  if (!open || open.type !== 'imei' || !open.data) return null

  return (
    <Dialog open={true} onOpenChange={() => setOpen(null)}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>
            Chi tiết IMEI - {open.data.colorName} ({open.data.ramCapacity}GB/
            {open.data.romCapacity}GB)
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết tất cả các imei
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='h-[400px] pr-4'>
          <DataTable columns={columns} data={open.data.productImeiResponses} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ImeiDialog
