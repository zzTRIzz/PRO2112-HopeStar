import * as z from "zod"

export const saleSchema = z.object({
  code: z.string()
    .min(1, "Mã chương trình không được để trống")
    .max(255, "Mã chương trình không được vượt quá 255 ký tự"),
    
  name: z.string()
    .min(1, "Tên chương trình không được để trống") 
    .max(255, "Tên chương trình không được vượt quá 255 ký tự"),

  dateStart: z.string()
    .min(1, "Ngày bắt đầu không được để trống"),

  dateEnd: z.string()
    .min(1, "Ngày kết thúc không được để trống"),

  status: z.enum(["ACTIVE", "INACTIVE", "UPCOMING"]),

  description: z.string()
    .max(1000, "Mô tả không được vượt quá 1000 ký tự")
    .optional(),

  discountValue: z.number()
    .min(0, "Giá trị giảm giá không được âm"),
  
  discountType: z.boolean()
}).refine((data) => {
  // Nếu là % thì không được vượt quá 100
  if (data.discountType && data.discountValue > 100) {
    return false;
  }
  return true;
}, {
  message: "Giá trị phần trăm không được vượt quá 100%",
  path: ["discountValue"] // Chỉ định lỗi này thuộc về trường discountValue
});

export type SaleFormValues = z.infer<typeof saleSchema>
