import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import { updateCard } from '../data/api-service'
import type { Card } from '../data/schema'

interface StatusSwitchProps {
  card: Card
}

export function StatusSwitch({ card }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(card.status === 'ACTIVE')

  useEffect(() => {
    setIsChecked(card.status === 'ACTIVE')
  }, [card.status])

  const { mutate } = useMutation({
    mutationFn: updateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
  })

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        mutate({
          ...card,
          status: checked ? 'ACTIVE' : 'IN_ACTIVE',
        })
      }}
    />
  )
}
