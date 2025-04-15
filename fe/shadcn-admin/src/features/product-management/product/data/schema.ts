import { z } from 'zod'

export const productResponseSchema = z.object({
  id: z.number().optional(),
  code: z.string(),
  name: z.string(),
  description: z.string(),
  weight: z.number(),
  nameChip: z.string(),
  nameBrand: z.string(),
  typeScreen: z.string(),
  typeCard: z.string(),
  nameOs: z.string(),
  nameWifi: z.string(),
  nameBluetooth: z.string(),
  frontCamera: z.array(z.string()),
  rearCamera: z.array(z.string()),
  category: z.array(z.string()),
  sim: z.array(z.string()),
  nfc: z.boolean(),
  typeBattery: z.string(),
  chargerType: z.string(),
  status: z.enum(['ACTIVE', 'IN_ACTIVE']),
  content: z.string(),
  totalNumber: z.number(),
  totalVersion: z.number(),
})

export const productRequestSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên sản phẩm là bắt buộc')
    .max(255, 'Tên sản phẩm không được quá 255 ký tự')
    .trim()
    .refine((value) => value.length > 0, {
      message: 'Không được nhập chỉ khoảng trắng',
    }),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  weight: z.number().min(1, 'Khối lượng phải lớn hơn 0'),
  idChip: z.number().min(1, 'Chip là bắt buộc'),
  idBrand: z.number().min(1, 'Thương hiệu là bắt buộc'),
  idScreen: z.number().min(1, 'Màn hình là bắt buộc'),
  idCard: z.number().min(1, 'Thẻ nhớ là bắt buộc'),
  idOs: z.number().min(1, 'Hệ điều hành là bắt buộc'),
  idWifi: z.number().min(1, 'WiFi là bắt buộc'),
  idBluetooth: z.number().min(1, 'Bluetooth là bắt buộc'),
  nfc: z.boolean(),
  idBattery: z.number().min(1, 'Pin là bắt buộc'),
  chargerType: z.string().min(1, 'Loại sạc là bắt buộc'),
  content: z.string(),
  frontCamera: z.array(z.string()).min(1, 'Phải có ít nhất một camera trước'),
  rearCamera: z.array(z.string()).min(1, 'Phải có ít nhất một camera sau'),
  category: z.array(z.string()).min(1, 'Phải có ít nhất một danh mục'),
  sim: z.array(z.string()).min(1, 'Phải có ít nhất một khe SIM'),
})

// First, define the IMEI request schema
export const productImeiRequestSchema = z.object({
  imeiCode: z.string(),
})

// Update the product detail request schema
export const productDetailRequestSchema = z.object({
  priceSell: z.number(),
  inventoryQuantity: z.number(),
  idRam: z.number(),
  idRom: z.number(),
  idColor: z.number(),
  productImeiRequests: z.array(productImeiRequestSchema),
  imageUrl: z.string(),
})

export const productConfigRequestSchema = z.object({
  productDetailRequests: z.array(productDetailRequestSchema),
  productRequest: productRequestSchema,
})

export type ProductResponse = z.infer<typeof productResponseSchema>
export type ProductRequest = z.infer<typeof productRequestSchema>
export type ProductDetailRequest = z.infer<typeof productDetailRequestSchema>
export type ProductConfigRequest = z.infer<typeof productConfigRequestSchema>
export type ProductImeiRequest = z.infer<typeof productImeiRequestSchema>

// Constants for select options
export const CHARGER_TYPES = ['Type-C', 'Lightning', 'Micro USB'] as const

interface StatusOption {
  value: 'ACTIVE' | 'IN_ACTIVE'
  name: string
}

export const STATUS: StatusOption[] = [
  {
    value: 'ACTIVE',
    name: 'Hoạt động',
  },
  {
    value: 'IN_ACTIVE',
    name: 'Không hoạt động',
  },
]

// Interface cho SearchProductRequest
export interface SearchProductRequest {
  key?: string
  idChip?: number
  idBrand?: number
  idScreen?: number
  idCard?: number
  idOs?: number
  idWifi?: number
  idBluetooth?: number
  idBattery?: number
  idCategory?: number
  status?: string
}

export const productUpdate = z.object({
  name: z
    .string()
    .min(1, 'Tên sản phẩm là bắt buộc')
    .max(255, 'Tên sản phẩm không được quá 255 ký tự')
    .trim()
    .refine((value) => value.length > 0, {
      message: 'Không được nhập chỉ khoảng trắng',
    }),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  weight: z.number().min(1, 'Khối lượng phải lớn hơn 0'),
  idChip: z.number().min(1, 'Chip là bắt buộc'),
  idBrand: z.number().min(1, 'Thương hiệu là bắt buộc'),
  idScreen: z.number().min(1, 'Màn hình là bắt buộc'),
  idCard: z.number().min(1, 'Thẻ nhớ là bắt buộc'),
  idOs: z.number().min(1, 'Hệ điều hành là bắt buộc'),
  idWifi: z.number().min(1, 'WiFi là bắt buộc'),
  idBluetooth: z.number().min(1, 'Bluetooth là bắt buộc'),
  nfc: z.boolean(),
  idBattery: z.number().min(1, 'Pin là bắt buộc'),
  chargerType: z.string().min(1, 'Loại sạc là bắt buộc'),
  content: z.string(),
})
export type ProductUpdate = z.infer<typeof productUpdate>
