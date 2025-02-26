import { useNavigate } from '@tanstack/react-router'
import { IconDownload, IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useTasks } from '../context/tasks-context'

export function TasksPrimaryButtons() {
  const navigate = useNavigate()

  function addNewProduct() {
    navigate({
      to: '/product/create-product',
    })
  }
  const { setOpen } = useTasks()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import</span> <IconDownload size={18} />
      </Button>
      <Button className='space-x-1' onClick={addNewProduct}>
        <span>Create</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
