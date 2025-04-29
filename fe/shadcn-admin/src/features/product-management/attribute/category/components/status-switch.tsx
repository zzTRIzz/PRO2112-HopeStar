import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import { updateCategory } from '../data/api-service'
import type { Category } from '../data/schema'

interface StatusSwitchProps {
  category: Category
}

export function StatusSwitch({ category }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(category.status === 'ACTIVE')

  useEffect(() => {
    setIsChecked(category.status === 'ACTIVE')
  }, [category.status])

  const { mutate } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        mutate({
          ...category,
          status: checked ? 'ACTIVE' : 'IN_ACTIVE',
        })
      }}
    />
  )
}
