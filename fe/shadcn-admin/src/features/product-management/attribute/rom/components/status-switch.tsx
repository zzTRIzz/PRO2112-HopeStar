import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import { updateRom } from '../data/api-service'
import type { Rom } from '../data/schema'

interface StatusSwitchProps {
  rom: Rom
}

export function StatusSwitch({ rom }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(rom.status === 'ACTIVE')

  useEffect(() => {
    setIsChecked(rom.status === 'ACTIVE')
  }, [rom.status])

  const { mutate } = useMutation({
    mutationFn: updateRom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roms'] })
    },
  })

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        mutate({
          ...rom,
          status: checked ? 'ACTIVE' : 'IN_ACTIVE',
        })
      }}
    />
  )
}
