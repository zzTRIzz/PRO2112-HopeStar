import { z } from 'zod'

export const otpRequestSchema = z.object({
  email: z.string(),
})

export type Otp = z.infer<typeof otpRequestSchema>
