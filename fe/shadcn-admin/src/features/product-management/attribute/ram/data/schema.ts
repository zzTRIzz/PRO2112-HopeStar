import { z } from 'zod'

export const ramSchema = z.object({
  id: z.number().optional(),
  capacity: z.number().min(1, 'Dung lượng lớn hơn 0'),
  description: z.string().min(1, 'Loại không được để trống'),
  status: z.string().min(1, 'Status is required'),
})

export type Ram = z.infer<typeof ramSchema>
