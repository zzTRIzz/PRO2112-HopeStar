import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import { updateBluetooth } from '../data/api-service'
import type { Bluetooth } from '../data/schema'

interface StatusSwitchProps {
  bluetooth: Bluetooth
}

export function StatusSwitch({ bluetooth }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(bluetooth.status === 'ACTIVE')

  useEffect(() => {
    setIsChecked(bluetooth.status === 'ACTIVE')
  }, [bluetooth.status])

  const { mutate } = useMutation({
    mutationFn: updateBluetooth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bluetooths'] })
    },
  })

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        mutate({
          ...bluetooth,
          status: checked ? 'ACTIVE' : 'IN_ACTIVE',
        })
      }}
    />
  )
}
