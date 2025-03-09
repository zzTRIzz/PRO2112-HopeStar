import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import { updateRam } from '../data/api-service'
import type { Ram } from '../data/schema'

interface StatusSwitchProps {
  ram: Ram
}

export function StatusSwitch({ ram }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(ram.status === 'ACTIVE')

  useEffect(() => {
    setIsChecked(ram.status === 'ACTIVE')
  }, [ram.status])

  const { mutate } = useMutation({
    mutationFn: updateRam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rams'] })
    },
  })

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        mutate({
          ...ram,
          status: checked ? 'ACTIVE' : 'IN_ACTIVE',
        })
      }}
    />
  )
}
