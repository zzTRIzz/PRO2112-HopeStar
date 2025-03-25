import { z } from 'zod'

// Schema cho Profile
export const accountResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  avatar: z.string(),
  idRole: z.number(),
  gender: z.boolean(),
})

// Schema cho ColorOption
const colorOptionSchema = z.object({
  id: z.number(),
  colorName: z.string(),
  colorCode: z.string(),
})

// Schema cho RamRomOption
const ramRomOptionSchema = z.object({
  ramId: z.number(),
  ramSize: z.string(),
  romId: z.number(),
  romSize: z.string(),
})

// Schema cho ProductDetailInfo
const productDetailInfoSchema = z.object({
  productDetailId: z.number(),
  price: z.number(),
  priceSell: z.number(),
  inventoryQuantity: z.number(),
  status: z.string(),
  imageUrl: z.string(),

  // Thêm thông tin về cặp RAM-ROM và màu sắc
  ramRomOption: ramRomOptionSchema,
  colorOption: colorOptionSchema,
})

export const productViewResponseSchema = z.object({
  idProduct: z.number().optional(),
  name: z.string(),
  idProductDetail: z.number().optional(),
  ram: z.array(z.number()),
  rom: z.array(z.number()),
  image: z.string(),
  price: z.number(),
  priceSeller: z.number(),
  hex: z.array(z.string()),
})

export const productViewResponseAllSchema = z.object({
  newestProducts: z.array(productViewResponseSchema),
  bestSellingProducts: z.array(productViewResponseSchema),
})

export const productDetailViewResponseSchema = z.object({
  id: z.number(),
  productName: z.string(),
  productDescription: z.string(),
  imageUrls: z.array(z.string()),
  // Danh sách các cặp RAM-ROM
  ramRomOptions: z.array(ramRomOptionSchema),

  // Danh sách các tùy chọn màu sắc
  colorOptions: z.array(colorOptionSchema),

  // Map để lưu trữ thông tin chi tiết sản phẩm
  productDetails: z.record(z.string(), productDetailInfoSchema),

  // Sản phẩm chi tiết mặc định
  defaultProductDetail: productDetailInfoSchema.optional(),
})

export type Profile = z.infer<typeof accountResponseSchema>
export type productViewResponse = z.infer<typeof productViewResponseSchema>
export type productDetailViewResponse = z.infer<
  typeof productDetailViewResponseSchema
>
export type ProductViewResponseAll = z.infer<
  typeof productViewResponseAllSchema
>
