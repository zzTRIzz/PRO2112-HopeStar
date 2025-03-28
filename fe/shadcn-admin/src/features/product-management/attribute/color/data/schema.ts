import { z } from 'zod'

export const colorSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Tên là bắt buộc'),
  description: z.string(),
  hex: z.string().min(1, 'Mã màu là bắt buộc'),
  status: z.string().min(1, 'Status is required'),
})

export type Color = z.infer<typeof colorSchema>
