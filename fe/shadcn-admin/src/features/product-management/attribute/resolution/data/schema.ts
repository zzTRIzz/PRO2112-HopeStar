import { z } from 'zod'

export const resolutionSchema = z.object({
  id: z.number().optional(),
  width: z.number().min(1, "Width greater than 0"),
  height: z.number().min(1, "Height greater than 0"), 
  resolutionType: z.string().min(1, "Resolution type is required"),
})

export type Resolution = z.infer<typeof resolutionSchema>
