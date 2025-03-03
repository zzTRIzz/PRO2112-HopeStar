import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import { updateBrand } from '../data/api-service'
import type { Brand } from '../data/schema'

interface StatusSwitchProps {
  brand: Brand
}

export function StatusSwitch({ brand }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(brand.status === 'ACTIVE')

  useEffect(() => {
    setIsChecked(brand.status === 'ACTIVE')
  }, [brand.status])

  const { mutate } = useMutation({
    mutationFn: updateBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    },
  })

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        mutate({
          ...brand,
          status: checked ? 'ACTIVE' : 'IN_ACTIVE',
        })
      }}
    />
  )
}
