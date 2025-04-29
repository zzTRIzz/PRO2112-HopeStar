import { z } from "zod"

// Schema định nghĩa kiểu dữ liệu
export const taiKhoanSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1, "Họ tên không được để trống"),
  gender: z.enum(["true", "false", "other"], {
    required_error: "Vui lòng chọn giới tính",
  }),
  email: z.string().email("Email không hợp lệ").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  idRole: z.enum(["ADMIN", "STAFF", "CUSTOMER"], {
    required_error: "Vui lòng chọn quyền hạn",
  }),
  status: z.boolean().default(true),
  createdAt: z.string().datetime(),
})