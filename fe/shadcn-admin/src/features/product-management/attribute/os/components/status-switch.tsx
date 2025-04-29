import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import { updateOs } from '../data/api-service'
import type { Os } from '../data/schema'

interface StatusSwitchProps {
  os: Os
}

export function StatusSwitch({ os }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(os.status === 'ACTIVE')

  useEffect(() => {
    setIsChecked(os.status === 'ACTIVE')
  }, [os.status])

  const { mutate } = useMutation({
    mutationFn: updateOs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['os'] })
    },
  })

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        mutate({
          ...os,
          status: checked ? 'ACTIVE' : 'IN_ACTIVE',
        })
      }}
    />
  )
}
