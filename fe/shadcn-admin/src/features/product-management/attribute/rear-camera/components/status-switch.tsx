import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import { updateRearCamera } from '../data/api-service'
import type { RearCamera } from '../data/schema'

interface StatusSwitchProps {
  rearCamera: RearCamera
}

export function StatusSwitch({ rearCamera }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(rearCamera.status === 'ACTIVE')

  useEffect(() => {
    setIsChecked(rearCamera.status === 'ACTIVE')
  }, [rearCamera.status])

  const { mutate } = useMutation({
    mutationFn: updateRearCamera,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rearCameras'] })
    },
  })

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        mutate({
          ...rearCamera,
          status: checked ? 'ACTIVE' : 'IN_ACTIVE',
        })
      }}
    />
  )
}
