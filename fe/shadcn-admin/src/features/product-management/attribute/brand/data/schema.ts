import { z } from 'zod'

export const brandSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  status: z.string().min(1, "Status is required"),
})

export type Brand = z.infer<typeof brandSchema>
