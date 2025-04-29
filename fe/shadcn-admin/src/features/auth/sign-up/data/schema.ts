import { z } from 'zod'

export const signupRequestSchema = z
  .object({
    fullName: z
      .string().trim()
      .min(1, {
        message: 'Vui lòng nhập họ và tên của bạn', // Please enter your full name
      })
      .min(7, {
        message: 'Tên không được ít hơn 7 ký tự', // Password must be at least 7 characters long
      })
      .max(30, {
        message: 'Tên không được vượt quá 30 ký tự', // Full name must not exceed 50 characters
      }),
    email: z
      .string()
      .min(1, { message: 'Vui lòng nhập email của bạn' }) // Please enter your email
      .email({ message: 'Địa chỉ email không hợp lệ' }), // Invalid email address
    password: z
      .string().trim()
      .min(1, {
        message: 'Vui lòng nhập mật khẩu của bạn', // Please enter your password
      })
      .min(7, {
        message: 'Mật khẩu phải có ít nhất 7 ký tự', // Password must be at least 7 characters long
      }).trim(),
    confirmPassword: z.string(),
    otp: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp.', // Passwords don't match
    path: ['confirmPassword'],
  })

export type Signup = z.infer<typeof signupRequestSchema>
