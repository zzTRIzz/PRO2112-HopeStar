import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addBrand, updateBrand } from '../data/api-service'
import type { Brand } from '../data/schema'

export function useBrandMutation(isUpdate = false) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Brand) => {
      if (isUpdate) {
        return updateBrand(data)
      }
      return addBrand(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error.message)
      throw error
    },
  })
}
