import { DialogDescription } from '@radix-ui/react-dialog'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ProductResponse } from '../data/schema'

const displayFieldClass =
  'mt-1 w-full rounded-md border px-3 py-2 text-sm font-medium text-foreground'
const displayBadgeClass = 'mt-1 flex flex-wrap gap-2 rounded-md border  p-2'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: ProductResponse
}

export function ProductDisplayDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  // Kiểm tra currentRow trước khi render
  if (!currentRow) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Thông tin chi tiết sản phẩm</DialogTitle>
          <DialogDescription>
            Đây là thông tin chi tiết sản phẩm.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='h-[400px] pr-4'>
          <div className='space-y-6'>
            {/* Basic Info */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium'>Mã sản phẩm</label>
                <p className={displayFieldClass}>{currentRow.code}</p>
              </div>
              <div>
                <label className='text-sm font-medium'>Tên sản phẩm</label>
                <p className={displayFieldClass}>{currentRow.name}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className='text-sm font-medium'>Mô tả</label>
              <p className={`${displayFieldClass} min-h-[80px]`}>
                {currentRow.description}
              </p>
            </div>

            {/* Technical Specs */}
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <label className='text-sm font-medium'>Chip</label>
                <p className={displayFieldClass}>{currentRow.nameChip}</p>
              </div>
              <div>
                <label className='text-sm font-medium'>Thương hiệu</label>
                <p className={displayFieldClass}>{currentRow.nameBrand}</p>
              </div>
              <div>
                <label className='text-sm font-medium'>Khối lượng</label>
                <p className={displayFieldClass}>{currentRow.weight}g</p>
              </div>
            </div>

            {/* Connectivity */}
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <label className='text-sm font-medium'>Hệ điều hành</label>
                <p className={displayFieldClass}>{currentRow.nameOs}</p>
              </div>
              <div>
                <label className='text-sm font-medium'>WiFi</label>
                <p className={displayFieldClass}>{currentRow.nameWifi}</p>
              </div>
              <div>
                <label className='text-sm font-medium'>Bluetooth</label>
                <p className={displayFieldClass}>{currentRow.nameBluetooth}</p>
              </div>
            </div>

            {/* Additional Features */}
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <label className='text-sm font-medium'>Pin</label>
                <p className={displayFieldClass}>{currentRow.typeBattery}</p>
              </div>
              <div>
                <label className='text-sm font-medium'>Sạc</label>
                <p className={displayFieldClass}>{currentRow.chargerType}</p>
              </div>
              <div>
                <label className='text-sm font-medium'>NFC</label>
                <p className={displayFieldClass}>
                  {currentRow.nfc ? 'Có' : 'Không'}
                </p>
              </div>
            </div>

            {/* Display & Graphics */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium'>Màn hình</label>
                <p className={displayFieldClass}>{currentRow.typeScreen}</p>
              </div>
              <div>
                <label className='text-sm font-medium'>Card đồ họa</label>
                <p className={displayFieldClass}>{currentRow.typeCard}</p>
              </div>
            </div>

            {/* Categories & SIM */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium'>Danh mục</label>
                <div className={displayBadgeClass}>
                  {(currentRow.category || []).map((cat, index) => (
                    <Badge key={index}>{cat}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className='text-sm font-medium'>SIM</label>
                <div className={displayBadgeClass}>
                  {(currentRow.sim || []).map((sim, index) => (
                    <Badge key={index}>{sim}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Cameras */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium'>Camera trước</label>
                <div className={displayBadgeClass}>
                  {(currentRow.frontCamera || []).map((cam, index) => (
                    <Badge key={index}>{cam}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className='text-sm font-medium'>Camera sau</label>
                <div className={displayBadgeClass}>
                  {(currentRow.rearCamera || []).map((cam, index) => (
                    <Badge key={index}>{cam}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
