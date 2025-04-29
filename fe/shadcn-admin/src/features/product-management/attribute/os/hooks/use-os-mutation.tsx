import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addOs, updateOs } from '../data/api-service'
import type { Os } from '../data/schema'

export function useOsMutation(isUpdate = false) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Os) => {
      if (isUpdate) {
        return updateOs(data)
      }
      return addOs(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['os'] })
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error.message)
      throw error
    },
  })
}
