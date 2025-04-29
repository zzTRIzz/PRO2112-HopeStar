import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addCard, updateCard } from '../data/api-service'
import type { Card } from '../data/schema'

export function useCardMutation(isUpdate = false) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Card) => {
      if (isUpdate) {
        return updateCard(data)
      }
      return addCard(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error.message)
      throw error
    },
  })
}
