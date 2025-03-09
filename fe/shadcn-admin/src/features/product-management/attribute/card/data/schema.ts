import { z } from 'zod'

export const cardSchema = z.object({
  id: z.number().optional(),
  type: z.string().min(1, "Type is required"),
  status: z.string().min(1, "Status is required"),
})

export type Card = z.infer<typeof cardSchema>
