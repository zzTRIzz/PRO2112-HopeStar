import { z } from 'zod'

export const simSchema = z.object({
  id: z.number().optional(),
  type: z.string().min(1, 'Loại sim là bắt buộc'),
  status: z.string().min(1, 'Status is required'),
})

export type Sim = z.infer<typeof simSchema>
