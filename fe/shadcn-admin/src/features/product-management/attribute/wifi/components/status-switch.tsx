import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import { updateWifi } from '../data/api-service'
import type { Wifi } from '../data/schema'

interface StatusSwitchProps {
  wifi: Wifi
}

export function StatusSwitch({ wifi }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(wifi.status === 'ACTIVE')

  useEffect(() => {
    setIsChecked(wifi.status === 'ACTIVE')
  }, [wifi.status])

  const { mutate } = useMutation({
    mutationFn: updateWifi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wifis'] })
    },
  })

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        mutate({
          ...wifi,
          status: checked ? 'ACTIVE' : 'IN_ACTIVE',
        })
      }}
    />
  )
}
