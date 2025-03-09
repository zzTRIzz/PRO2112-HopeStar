import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addRom, updateRom } from '../data/api-service'
import type { Rom } from '../data/schema'

export function useRomMutation(isUpdate = false) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Rom) => {
      if (isUpdate) {
        return updateRom(data)
      }
      return addRom(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roms'] })
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error.message)
      throw error
    },
  })
}
