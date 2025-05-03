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

// Schema cho ProductAttribute
const productAttributeSchema = z.object({
  categories: z.string(),
  weight: z.number(),
  brand: z.string(),
  chip: z.string(),
  battery: z.string(),
  resolution: z.string(),
  screen: z.string(),
  bluetooth: z.string(),
  card: z.string(),
  os: z.string(),
  wifi: z.string(),
  charger: z.string(),
  nfc: z.string(),
  sim: z.string(),
  frontCamera: z.string(),
  rearCamera: z.string(),
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
  ram: z.array(z.string()),
  rom: z.array(z.string()),
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
  // Thông tin thuộc tính sản phẩm
  attribute: productAttributeSchema,
  // Map để lưu trữ thông tin chi tiết sản phẩm
  productDetails: z.record(z.string(), productDetailInfoSchema),
  // Sản phẩm chi tiết mặc định
  availableColors:z.record(z.string(), z.array(colorOptionSchema)),
  defaultProductDetail: productDetailInfoSchema.optional(),
})

// Types
export type Profile = z.infer<typeof accountResponseSchema>
export type productViewResponse = z.infer<typeof productViewResponseSchema>
export type productDetailViewResponse = z.infer<typeof productDetailViewResponseSchema>
export type ProductViewResponseAll = z.infer<typeof productViewResponseAllSchema>
export type ProductAttribute = z.infer<typeof productAttributeSchema>

// Schema cho CartDetail
export const cartDetailResponseSchema = z.object({
  id: z.number(),
  idProduct: z.number(),
  productName: z.string(),
  quantity: z.number(),
  ram: z.string(),
  rom: z.string(),
  color: z.string(),
  price: z.number(),
  image: z.string(),
  priceSell: z.number(),
})

// Schema cho Cart
export const cartResponseSchema = z.object({
  quantityCartDetail: z.number(),
  cartDetailResponseList: z.array(cartDetailResponseSchema),
})

export type CartDetailResponse = z.infer<typeof cartDetailResponseSchema>
export type CartResponse = z.infer<typeof cartResponseSchema>