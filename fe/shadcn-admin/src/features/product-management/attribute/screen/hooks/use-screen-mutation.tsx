import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addScreen, updateScreen } from '../data/api-service'
import type { Screen } from '../data/schema'

export function useScreenMutation(isUpdate = false) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Screen) => {
      if (isUpdate) {
        return updateScreen(data)
      }
      return addScreen(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['screens'] })
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error.message)
      throw error
    },
  })
}
