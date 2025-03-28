import { z } from 'zod'

export const resolutionSchema = z.object({
  id: z.number().optional(),
  width: z.number().min(1, 'Độ rộng lớn hơn 0'),
  height: z.number().min(1, 'Độ dài lớn hơn 0'),
  resolutionType: z.string().min(1, 'Độ phân giải là bắt buộc'),
})

export type Resolution = z.infer<typeof resolutionSchema>
