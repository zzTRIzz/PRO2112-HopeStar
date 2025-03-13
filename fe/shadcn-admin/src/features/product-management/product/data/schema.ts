import { z } from 'zod'

export const productSchema = z.object({
  id: z.number().optional(),
  code: z.string().min(1, "Product code is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  weight: z.number().min(0, "Weight must be positive"),
  nameChip: z.string().min(1, "Chip name is required"),
  nameBrand: z.string().min(1, "Brand name is required"),
  typeScreen: z.string().min(1, "Screen type is required"),
  typeCard: z.string().min(1, "Card type is required"),
  nameOs: z.string().min(1, "OS name is required"),
  nameWifi: z.string().min(1, "WiFi name is required"),
  nameBluetooth: z.string().min(1, "Bluetooth name is required"),
  frontCamera: z.array(z.string()).min(1, "At least one front camera is required"),
  rearCamera: z.array(z.string()).min(1, "At least one rear camera is required"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  sim: z.array(z.string()).min(1, "At least one sim is required"),
  nfc: z.boolean(),
  typeBattery: z.string().min(1, "Battery type is required"),
  chargerType: z.string().min(1, "Charger type is required"),
  status: z.string().min(1, "Status is required"),
  content: z.string(),
  totalNumber: z.number(),
  totalVersion: z.number()
})

export const productResponseSchema = z.object({
  id: z.number().optional(),
  code: z.string().min(1, "Product code is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  weight: z.number().min(0, "Weight must be positive"),
  nameChip: z.string().min(1, "Chip name is required"),
  nameBrand: z.string().min(1, "Brand name is required"),
  typeScreen: z.string().min(1, "Screen type is required"),
  typeCard: z.string().min(1, "Card type is required"),
  nameOs: z.string().min(1, "OS name is required"),
  nameWifi: z.string().min(1, "WiFi name is required"),
  nameBluetooth: z.string().min(1, "Bluetooth name is required"),
  frontCamera: z.array(z.string()).min(1, "At least one front camera is required"),
  rearCamera: z.array(z.string()).min(1, "At least one rear camera is required"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  sim: z.array(z.string()).min(1, "At least one sim is required"),
  nfc: z.boolean(),
  typeBattery: z.string().min(1, "Battery type is required"),
  chargerType: z.string().min(1, "Charger type is required"),
  status: z.enum(['ACTIVE', 'IN_ACTIVE']),
  content: z.string(),
  totalNumber: z.number(),
  totalVersion: z.number()
})

export const productRequestSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  weight: z.number().min(1, "Weight must be positive"),
  idChip: z.number(),
  idBrand: z.number(),
  idScreen: z.number(),
  idCard: z.number(),
  idOs: z.number(),
  idWifi: z.number(),
  idBluetooth: z.number(),
  nfc: z.boolean(),
  idBattery: z.number(),
  chargerType: z.string().min(1, "Charger type is required"),
  content: z.string(),
  frontCamera: z.array(z.string()).min(1, "At least one front camera is required"),
  rearCamera: z.array(z.string()).min(1, "At least one rear camera is required"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  sim: z.array(z.string()).min(1, "At least one sim is required"),
})

// First, define the IMEI request schema
export const productImeiRequestSchema = z.object({
  imeiCode: z.string()
})

// Update the product detail request schema
export const productDetailRequestSchema = z.object({
  priceSell: z.number().min(0, "Price must be positive"),
  inventoryQuantity: z.number().min(0, "Quantity must be positive"),
  idRam: z.number(),
  idRom: z.number(),
  idColor: z.number(),
  productImeiRequests: z.array(productImeiRequestSchema),
  imageUrl: z.string()
})

export const productConfigRequestSchema = z.object({
  productDetailRequests: z.array(productDetailRequestSchema),
  productRequest: productRequestSchema
})

export type Product = z.infer<typeof productSchema>
export type ProductResponse = z.infer<typeof productResponseSchema>
export type ProductRequest = z.infer<typeof productRequestSchema>
export type ProductDetailRequest = z.infer<typeof productDetailRequestSchema>
export type ProductConfigRequest = z.infer<typeof productConfigRequestSchema>
export type ProductImeiRequest = z.infer<typeof productImeiRequestSchema>

// Constants for select options
export const CHARGER_TYPES = ['Type-C', 'Lightning', 'Micro USB'] as const
