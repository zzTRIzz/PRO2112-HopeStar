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
  nfc: z.boolean(),
  typeBattery: z.string().min(1, "Battery type is required"),
  chargerType: z.string().min(1, "Charger type is required"),
  status: z.string().min(1, "Status is required"),
  content: z.string().min(1, "Content is required"),
  totalNumber: z.number(),
  totalVersion: z.number()
})


export type Product = z.infer<typeof productSchema>

// Constants for select options
export const SCREEN_TYPES = ['AMOLED', 'IPS', 'LCD'] as const
export const CARD_TYPES = ['microSDHC', 'microSDXC', 'None'] as const
export const BATTERY_TYPES = ['Li-ion', 'Li-Po'] as const
export const CHARGER_TYPES = ['Type-C', 'Lightning', 'Micro USB'] as const
export const STATUS_OPTIONS = ['ACTIVE', 'IN_ACTIVE'] as const
