import { z } from 'zod'

export const frontCameraSchema = z.object({
  id: z.number().optional(),
  type: z.string().min(1, 'Loại camera là bắt buộc'),
  resolution: z.number().min(1, 'Độ phân giải là lớn hơn 0'),
  status: z.string().min(1, 'Status is required'),
})

export type FrontCamera = z.infer<typeof frontCameraSchema>
