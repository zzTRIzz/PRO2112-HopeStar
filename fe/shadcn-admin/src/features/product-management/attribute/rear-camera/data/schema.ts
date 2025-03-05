import { z } from 'zod'

export const rearCameraSchema = z.object({
  id: z.number().optional(),
  type: z.string().min(1, "Type is required"),
  resolution: z.number().min(1, "Resolution is required"),
  status: z.string().min(1, "Status is required"),
})

export type RearCamera = z.infer<typeof rearCameraSchema>
