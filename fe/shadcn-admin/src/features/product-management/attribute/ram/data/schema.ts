import { z } from 'zod'

export const ramSchema = z.object({
  id: z.number().optional(),
  capacity: z.number().min(1, "Capacity is required"),
  description: z.string(),
  status: z.string().min(1, "Status is required"),
})

export type Ram = z.infer<typeof ramSchema>
