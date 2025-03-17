import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addChip, updateChip } from '../data/api-service'
import type { Chip } from '../data/schema'

export function useChipMutation(isUpdate = false) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Chip) => {
      if (isUpdate) {
        return updateChip(data)
      }
      return addChip(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chips'] })
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error.message)
      throw error
    },
  })
}
