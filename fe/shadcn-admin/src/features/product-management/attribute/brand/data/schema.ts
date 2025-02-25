import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const brandSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  status: z.string(),
})

export type Brand = z.infer<typeof brandSchema>
