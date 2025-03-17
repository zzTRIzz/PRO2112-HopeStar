import { z } from 'zod'

export const chipSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  status: z.string().min(1, "Status is required"),
})

export type Chip = z.infer<typeof chipSchema>
