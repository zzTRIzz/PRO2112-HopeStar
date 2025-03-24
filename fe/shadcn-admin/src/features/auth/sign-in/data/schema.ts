import { z } from 'zod'

export const loginRequestSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Vui lòng nhập email' })
    .email({ message: 'Email không hợp lệ' }),
  password: z
    .string()
    .min(1, {
      message: 'Vui lòng nhập mật khẩu',
    })
    .min(7, {
      message: 'Mật khẩu phải có ít nhất 7 ký tự',
    }),
})

export type Login = z.infer<typeof loginRequestSchema>
