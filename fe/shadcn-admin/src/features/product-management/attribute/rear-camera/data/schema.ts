import { z } from 'zod'

export const rearCameraSchema = z.object({
  id: z.number().optional(),
  type: z
    .string()
    .min(1, 'Loại camera là bắt buộc')
    .max(255, 'Loại không được quá 255 ký tự')
    .trim()
    .refine((value) => value.length > 0, {
      message: 'Không được nhập chỉ khoảng trắng',
    }),
  resolution: z.number().min(1, 'Độ phân giải lớn hơn 0'),
  status: z.string().min(1, 'Status is required'),
})

export type RearCamera = z.infer<typeof rearCameraSchema>
