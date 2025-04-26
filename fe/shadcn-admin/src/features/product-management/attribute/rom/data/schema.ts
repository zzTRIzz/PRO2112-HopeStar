import { z } from 'zod'

export const romSchema = z.object({
  id: z.number().optional(),
  capacity: z.number().min(1, 'Dung lượng lớn hơn 0'),
  description: z
    .string()
    .min(1, 'Loại không được để trống')
    .max(255, 'Loại không được quá 255 ký tự')
    .trim()
    .refine((value) => value.length > 0, {
      message: 'Không được nhập chỉ khoảng trắng',
    })
    .refine((value) => ['GB', 'TB'].includes(value), {
      message: 'Chỉ chấp nhận giá trị GB hoặc TB',
    }),
  status: z.string().min(1, 'Status is required'),
})

export type Rom = z.infer<typeof romSchema>
