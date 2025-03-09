import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addColor, updateColor } from '../data/api-service'
import type { Color } from '../data/schema'

export function useColorMutation(isUpdate = false) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Color) => {
      if (isUpdate) {
        return updateColor(data)
      }
      return addColor(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] })
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error.message)
      throw error
    },
  })
}
