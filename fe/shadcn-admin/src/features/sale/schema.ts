import * as z from "zod"

export const saleSchema = z.object({
  code: z.string()
    .min(1, "Mã chương trình không được để trống")
    .max(255, "Mã chương trình không được vượt quá 255 ký tự"),
    
  name: z.string()
    .min(1, "Tên chương trình không được để trống") 
    .max(255, "Tên chương trình không được vượt quá 255 ký tự"),

  dateStart: z.string()
    .min(1, "Ngày bắt đầu không được để trống")
    .transform((date) => {
      const d = new Date(date);
      const now = new Date();
      d.setHours(now.getHours());
      d.setMinutes(now.getMinutes());
      d.setSeconds(now.getSeconds());
      return d.toISOString();
    }),

  dateEnd: z.string()
    .min(1, "Ngày kết thúc không được để trống")
    .transform((date) => {
      const d = new Date(date);
      const now = new Date(); 
      d.setHours(23);
      d.setMinutes(59);
      d.setSeconds(59);
      return d.toISOString();
    }),

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
  path: ["discountValue"]
}).refine((data) => {
  // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
  const start = new Date(data.dateStart);
  const end = new Date(data.dateEnd);
  return end > start;
}, {
  message: "Ngày kết thúc phải sau ngày bắt đầu",
  path: ["dateEnd"]
});

export type SaleFormValues = z.infer<typeof saleSchema>
