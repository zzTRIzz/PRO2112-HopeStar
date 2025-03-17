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
import type { Product } from '../data/schema'

interface StatusSwitchProps {
  product: Product
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
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status to{' '}
              {pendingStatus ? 'Active' : 'Inactive'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
