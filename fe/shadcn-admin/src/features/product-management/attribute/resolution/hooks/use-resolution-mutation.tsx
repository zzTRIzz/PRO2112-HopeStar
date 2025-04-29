import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addResolution, updateResolution } from '../data/api-service'
import type { Resolution } from '../data/schema'

export function useResolutionMutation(isUpdate = false) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Resolution) => {
      if (isUpdate) {
        return updateResolution(data)
      }
      return addResolution(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resolutions'] })
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error.message)
      throw error
    },
  })
}
