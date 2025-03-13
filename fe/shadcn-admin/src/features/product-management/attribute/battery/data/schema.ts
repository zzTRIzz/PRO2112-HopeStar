import { z } from 'zod'

export const batterySchema = z.object({
  id: z.number().optional(),
  type: z.string().trim().min(1, "Type is required"),
  capacity: z.number().min(1, "Capacity is required"),
  status: z.string().min(1, "Status is required"),
})

export type Battery = z.infer<typeof batterySchema>
