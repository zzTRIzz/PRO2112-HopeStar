import { z } from 'zod'

export const batterySchema = z.object({
  id: z.number().optional(),
  type: z
    .string()
    .min(1, 'Loại pin là bắt buộc')
    .max(255, 'Loại không được quá 255 ký tự')
    .trim()
    .refine((value) => value.length > 0, {
      message: 'Không được nhập chỉ khoảng trắng',
    }),
  capacity: z.number().min(1, 'Dung lượng lớn hơn 0'),
  status: z.string().min(1, 'Status is required'),
})

export type Battery = z.infer<typeof batterySchema>
