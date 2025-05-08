import { z } from 'zod'

// Define the StatusImei enum
export const StatusImeiEnum = z.enum([
  'IN_ACTIVE',
  'SOLD',
  'NOT_SOLD',
])

// Define the ProductImeiResponse schema
export const ProductImeiResponseSchema = z.object({
  id: z.number(),
  code: z.string(),
  barCode: z.string(),
  statusImei: StatusImeiEnum,
})

// Define the main ProductDetailResponse schema
export const ProductDetailResponseSchema = z
  .object({
    id: z.number(),
    code: z.string(),
    priceSell: z.number(),
    inventoryQuantity: z.number(),
    status: z.enum(['ACTIVE', 'IN_ACTIVE','DESIST']),
    colorName: z.string(),
    ramCapacity: z.string(),
    romCapacity: z.string(),
    imageUrl: z.string(),
    productImeiResponses: z.array(ProductImeiResponseSchema),
  })
  .partial()

// Define TypeScript types from the schemas
export type StatusImei = z.infer<typeof StatusImeiEnum>
export type ProductImeiResponse = z.infer<typeof ProductImeiResponseSchema>
export type ProductDetailResponse = z.infer<typeof ProductDetailResponseSchema>

export const productDetailUpdateSchema = z.object({
  priceSell: z.number().min(0, 'Giá bán phải lớn hơn 0'),
  imageUrl: z.string().min(1, 'Vui lòng chọn hình ảnh'),
})

export type ProductDetailUpdate = z.infer<typeof productDetailUpdateSchema>
