import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import { updateFrontCamera } from '../data/api-service'
import type { FrontCamera } from '../data/schema'

interface StatusSwitchProps {
  frontCamera: FrontCamera
}

export function StatusSwitch({ frontCamera }: StatusSwitchProps) {
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(frontCamera.status === 'ACTIVE')

  useEffect(() => {
    setIsChecked(frontCamera.status === 'ACTIVE')
  }, [frontCamera.status])

  const { mutate } = useMutation({
    mutationFn: updateFrontCamera,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frontCameras'] })
    },
  })

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        mutate({
          ...frontCamera,
          status: checked ? 'ACTIVE' : 'IN_ACTIVE',
        })
      }}
    />
  )
}
