import { IconDownload } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useDialog } from '../context/dialog-context'
import { DialogType } from './product-detail-dialogs'

export function ProductDetailPrimaryButtons() {
  const { setOpen } = useDialog()

  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen(DialogType.IMPORT)}
      >
        <span>Import</span> <IconDownload size={18} />
      </Button>
    </div>
  )
}
