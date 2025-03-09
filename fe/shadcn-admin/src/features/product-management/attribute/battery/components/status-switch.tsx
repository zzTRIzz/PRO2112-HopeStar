import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import { updateBattery } from '../data/api-service'
import type { Battery } from '../data/schema'

interface StatusSwitchProps {
  battery: Battery
}

export function StatusSwitch({ battery }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(battery.status === 'ACTIVE')

  useEffect(() => {
    setIsChecked(battery.status === 'ACTIVE')
  }, [battery.status])

  const { mutate } = useMutation({
    mutationFn: updateBattery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batteries'] })
    },
  })

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        mutate({
          ...battery,
          status: checked ? 'ACTIVE' : 'IN_ACTIVE',
        })
      }}
    />
  )
}
