import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import { updateChip } from '../data/api-service'
import type { Chip } from '../data/schema'

interface StatusSwitchProps {
  chip: Chip
}

export function StatusSwitch({ chip }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(chip.status === 'ACTIVE')

  useEffect(() => {
    setIsChecked(chip.status === 'ACTIVE')
  }, [chip.status])

  const { mutate } = useMutation({
    mutationFn: updateChip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chips'] })
    },
  })

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        mutate({
          ...chip,
          status: checked ? 'ACTIVE' : 'IN_ACTIVE',
        })
      }}
    />
  )
}
