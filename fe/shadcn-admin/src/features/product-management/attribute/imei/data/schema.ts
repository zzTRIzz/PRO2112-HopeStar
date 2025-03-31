import { z } from 'zod'

// Define StatusImei enum to match backend
export enum StatusImei {
  IN_THE_CART = 'IN_THE_CART',
  SOLD = 'SOLD',
  NOT_SOLD = 'NOT_SOLD',
  PENDING_DELIVERY = 'PENDING_DELIVERY',
  CANCELLED = 'CANCELLED',
  IN_ACTIVE = 'IN_ACTIVE',
}

export const imeiResponseSchema = z.object({
  id: z.number().optional(),
  productName: z.string().min(1, 'Tên sản phẩm không được để trống'),
  imeiCode: z.string().min(15, 'IMEI phải có 15 kí tự').max(15, 'IMEI phải có 15 kí tự'),
  barCode: z.string().optional(),
  status: z.nativeEnum(StatusImei, {
    required_error: 'Trạng thái không được để trống',
    invalid_type_error: 'Trạng thái không hợp lệ',
  }),
})

// Type for TypeScript
export type ImeiResponse = z.infer<typeof imeiResponseSchema>

// Request schema for creating/updating IMEI
export const imeiRequestSchema = z.object({
  imeiCode: z.string().min(15, 'IMEI phải có 15 kí tự').max(15, 'IMEI phải có 15 kí tự'),
})

export type ImeiRequest = z.infer<typeof imeiRequestSchema>
