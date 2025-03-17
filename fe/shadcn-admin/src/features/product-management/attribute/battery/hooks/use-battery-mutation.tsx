import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addBattery, updateBattery } from '../data/api-service'
import type { Battery } from '../data/schema'

export function useBatteryMutation(isUpdate = false) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Battery) => {
      if (isUpdate) {
        return updateBattery(data)
      }
      return addBattery(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batteries'] })
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error.message)
      throw error
    },
  })
}
