import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addWifi, updateWifi } from '../data/api-service'
import type { Wifi } from '../data/schema'

export function useWifiMutation(isUpdate = false) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Wifi) => {
      if (isUpdate) {
        return updateWifi(data)
      }
      return addWifi(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wifis'] })
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error.message)
      throw error
    },
  })
}
