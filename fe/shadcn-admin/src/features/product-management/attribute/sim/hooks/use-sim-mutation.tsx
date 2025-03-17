import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addSim, updateSim } from '../data/api-service'
import type { Sim } from '../data/schema'

export function useSimMutation(isUpdate = false) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Sim) => {
      if (isUpdate) {
        return updateSim(data)
      }
      return addSim(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sims'] })
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error.message)
      throw error
    },
  })
}
