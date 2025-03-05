import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import { updateColor } from '../data/api-service'
import type { Color } from '../data/schema'

interface StatusSwitchProps {
  color: Color
}

export function StatusSwitch({ color }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(color.status === 'ACTIVE')

  useEffect(() => {
    setIsChecked(color.status === 'ACTIVE')
  }, [color.status])

  const { mutate } = useMutation({
    mutationFn: updateColor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] })
    },
  })

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        mutate({
          ...color,
          status: checked ? 'ACTIVE' : 'IN_ACTIVE',
        })
      }}
    />
  )
}
