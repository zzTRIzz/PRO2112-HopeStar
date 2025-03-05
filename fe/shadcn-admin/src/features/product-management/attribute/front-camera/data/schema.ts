import { z } from 'zod'

export const frontCameraSchema = z.object({
  id: z.number().optional(),
  type: z.string().min(1, "Type is required"),
  resolution: z.number().min(1, "Resolution is required"),
  status: z.string().min(1, "Status is required"),
})

export type FrontCamera = z.infer<typeof frontCameraSchema>
