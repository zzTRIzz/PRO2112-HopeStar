import { z } from 'zod'

export const colorSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  hex: z.string().min(1, "Hex is required"),
  status: z.string().min(1, "Status is required"),
})

export type Color = z.infer<typeof colorSchema>
