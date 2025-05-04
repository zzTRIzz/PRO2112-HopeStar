import { useNavigate } from '@tanstack/react-router'
import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useProduct } from '../context/product-context'

export function ProductPrimaryButtons() {
  const navigate = useNavigate()
  const { setOpen } = useProduct()
  function addNewProduct() {
    navigate({
      to: '/product/create-product',
    })
    setOpen('create')
  }
  return (
    <div className='flex gap-2'>
      {/* <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Tải tệp</span> <IconDownload size={18} />
      </Button> */}
      <Button className='space-x-1' onClick={addNewProduct}>
        <span>Tạo</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
