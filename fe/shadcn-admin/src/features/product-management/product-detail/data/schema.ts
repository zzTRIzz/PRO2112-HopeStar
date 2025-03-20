import { z } from 'zod'

// Define the StatusImei enum
export const StatusImeiEnum = z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'SOLD'])

// Define the ProductImeiResponse schema
export const ProductImeiResponseSchema = z.object({
  id: z.number(),
  imeiCode: z.string(),
  barCode: z.string(),
  statusImei: StatusImeiEnum
})

// Define the ProductDetailStatus enum
export const ProductDetailStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'PENDING'])

// Define the main ProductDetailResponse schema
export const ProductDetailResponseSchema = z.object({
  id: z.number(),
  code: z.string(),
  priceSell: z.number(),
  inventoryQuantity: z.number(),
  status: ProductDetailStatusEnum,
  colorName: z.string(),
  ramCapacity: z.number(),
  romCapacity: z.number(),
  imageUrl: z.string(),
  productImeiResponses: z.array(ProductImeiResponseSchema)
})

// Define TypeScript types from the schemas
export type StatusImei = z.infer<typeof StatusImeiEnum>
export type ProductImeiResponse = z.infer<typeof ProductImeiResponseSchema>
export type ProductDetailStatus = z.infer<typeof ProductDetailStatusEnum>
export type ProductDetailResponse = z.infer<typeof ProductDetailResponseSchema>