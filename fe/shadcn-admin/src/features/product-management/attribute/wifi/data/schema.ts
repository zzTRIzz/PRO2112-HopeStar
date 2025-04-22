import { z } from 'zod'

export const wifiSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, 'Loại là bắt buộc')
    .max(255, 'Tên không được quá 255 ký tự')
    .trim()
    .refine((value) => value.length > 0, {
      message: 'Không được nhập chỉ khoảng trắng',
    }),
  status: z.string().min(1, 'Status is required'),
})

export type Wifi = z.infer<typeof wifiSchema>
