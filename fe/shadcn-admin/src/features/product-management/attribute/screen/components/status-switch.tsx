import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import { updateScreen } from '../data/api-service'
import type { Screen } from '../data/schema'

interface StatusSwitchProps {
  screen: Screen
}

export function StatusSwitch({ screen }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(screen.status === 'ACTIVE')

  useEffect(() => {
    setIsChecked(screen.status === 'ACTIVE')
  }, [screen.status])

  const { mutate } = useMutation({
    mutationFn: updateScreen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['screens'] })
    },
  })

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        mutate({
          ...screen,
          status: checked ? 'ACTIVE' : 'IN_ACTIVE',
        })
      }}
    />
  )
}
