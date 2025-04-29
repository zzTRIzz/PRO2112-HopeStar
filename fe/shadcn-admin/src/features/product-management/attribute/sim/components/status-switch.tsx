import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import { updateSim } from '../data/api-service'
import type { Sim } from '../data/schema'

interface StatusSwitchProps {
  sim: Sim
}

export function StatusSwitch({ sim }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(sim.status === 'ACTIVE')

  useEffect(() => {
    setIsChecked(sim.status === 'ACTIVE')
  }, [sim.status])

  const { mutate } = useMutation({
    mutationFn: updateSim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sims'] })
    },
  })

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        mutate({
          ...sim,
          status: checked ? 'ACTIVE' : 'IN_ACTIVE',
        })
      }}
    />
  )
}
