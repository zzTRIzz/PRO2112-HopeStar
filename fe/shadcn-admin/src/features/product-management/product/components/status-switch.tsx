import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { updateStatus } from '../data/api-service'
import type { ProductResponse } from '../data/schema'

interface StatusSwitchProps {
  product: ProductResponse
}

export function StatusSwitch({ product }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(product.status === 'ACTIVE')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null)

  useEffect(() => {
    setIsChecked(product.status === 'ACTIVE')
  }, [product.status])

  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const handleStatusChange = (checked: boolean) => {
    setPendingStatus(checked)
    setShowConfirmDialog(true)
  }

  const handleConfirm = () => {
    if (pendingStatus !== null) {
      setIsChecked(pendingStatus)
      mutate({
        ...product,
        status: pendingStatus ? 'ACTIVE' : 'IN_ACTIVE',
      })
      setShowConfirmDialog(false)
      setPendingStatus(null)
    }
  }

  return (
    <>
      <Switch checked={isChecked} onCheckedChange={handleStatusChange} />

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thay đổi trạng thái</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thay đổi trạng thái thành{' '}
              {pendingStatus ? 'Hoạt động' : 'Không hoạt động'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
