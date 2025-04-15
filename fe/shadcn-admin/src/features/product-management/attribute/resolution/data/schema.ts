import { z } from 'zod'

export const resolutionSchema = z.object({
  id: z.number().optional(),
  width: z.number().min(1, 'Độ rộng lớn hơn 0'),
  height: z.number().min(1, 'Độ dài lớn hơn 0'),
  resolutionType: z
    .string()
    .min(1, 'Độ phân giải là bắt buộc')
    .max(255, 'Độ phân giải không được quá 255 ký tự')
    .trim()
    .refine((value) => value.length > 0, {
      message: 'Không được nhập chỉ khoảng trắng',
    }),
})

export type Resolution = z.infer<typeof resolutionSchema>
