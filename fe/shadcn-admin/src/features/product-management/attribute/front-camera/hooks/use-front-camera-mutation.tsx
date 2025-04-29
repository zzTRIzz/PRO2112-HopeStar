import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addFrontCamera, updateFrontCamera } from '../data/api-service'
import type { FrontCamera } from '../data/schema'

export function useFrontCameraMutation(isUpdate = false) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: FrontCamera) => {
      if (isUpdate) {
        return updateFrontCamera(data)
      }
      return addFrontCamera(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frontCameras'] })
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error.message)
      throw error
    },
  })
}
