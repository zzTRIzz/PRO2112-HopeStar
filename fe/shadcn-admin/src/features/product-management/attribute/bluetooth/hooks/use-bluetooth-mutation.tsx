import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addBluetooth, updateBluetooth } from '../data/api-service'
import type { Bluetooth } from '../data/schema'

export function useBluetoothMutation(isUpdate = false) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Bluetooth) => {
      if (isUpdate) {
        return updateBluetooth(data)
      }
      return addBluetooth(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bluetooths'] })
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error.message)
      throw error
    },
  })
}
