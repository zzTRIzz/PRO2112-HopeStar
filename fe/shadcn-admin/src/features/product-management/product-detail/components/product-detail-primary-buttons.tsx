import { IconDownload } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useDialog } from '../context/dialog-context'

export function ProductDetailPrimaryButtons() {
  const { setOpen } = useDialog()

  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('add')}
      >
        <span>Tải tệp</span> <IconDownload size={18} />
      </Button>
    </div>
  )
}
