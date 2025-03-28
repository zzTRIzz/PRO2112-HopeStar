import { z } from 'zod'

export const wifiSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Loại là bắt buộc'),
  status: z.string().min(1, 'Status is required'),
})

export type Wifi = z.infer<typeof wifiSchema>
