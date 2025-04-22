import { z } from 'zod'

export const cardSchema = z.object({
  id: z.number().optional(),
  type: z
    .string()
    .min(1, 'Loại thẻ là bắt buộc')
    .max(255, 'Loại thẻ không được quá 255 ký tự')
    .trim()
    .refine((value) => value.length > 0, {
      message: 'Không được nhập chỉ khoảng trắng',
    }),
  status: z.string().min(1, 'Status is required'),
})

export type Card = z.infer<typeof cardSchema>
