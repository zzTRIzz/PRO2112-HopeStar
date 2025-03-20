import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

export function TasksPrimaryButtons() {
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1'>
        <span>Tạo</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
