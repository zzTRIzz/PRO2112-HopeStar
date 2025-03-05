import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addRearCamera, updateRearCamera } from '../data/api-service'
import type { RearCamera } from '../data/schema'

export function useRearCameraMutation(isUpdate = false) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: RearCamera) => {
      if (isUpdate) {
        return updateRearCamera(data)
      }
      return addRearCamera(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rearCameras'] })
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error.message)
      throw error
    },
  })
}
