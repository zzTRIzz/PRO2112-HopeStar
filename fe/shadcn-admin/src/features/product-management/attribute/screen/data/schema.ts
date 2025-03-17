import { z } from 'zod'
import { resolutionSchema } from '../../resolution/data/schema'

export const screenSchema = z.object({
  id: z.number().optional(),
  type: z.string().min(1, "Type is required"),
  displaySize: z.number().min(0, "Display size must be positive"),
  resolution: resolutionSchema,
  status: z.string().min(1, "Status is required"),
  refreshRate: z.number().min(0, "Refresh rate must be positive"),
})

export type Screen = z.infer<typeof screenSchema>
