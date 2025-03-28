import { z } from 'zod'
import { resolutionSchema } from '../../resolution/data/schema'

export const screenSchema = z.object({
  id: z.number().optional(),
  type: z.string().min(1, 'Loại là bắt buộc'),
  displaySize: z.number().min(1, 'Kích thước hiển thị phải lớn hơn 0'),
  resolution: resolutionSchema,
  status: z.string().min(1, 'Status is required'),
  refreshRate: z.number().min(1, 'Tần số quét phải lớn hơn 0'),
})

export type Screen = z.infer<typeof screenSchema>
