import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addRam, updateRam } from '../data/api-service'
import type { Ram } from '../data/schema'

export function useRamMutation(isUpdate = false) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Ram) => {
      if (isUpdate) {
        return updateRam(data)
      }
      return addRam(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rams'] })
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error.message)
      throw error
    },
  })
}
