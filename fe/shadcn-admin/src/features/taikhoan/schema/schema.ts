export interface TaiKhoan {
  id: number
  code: string
  fullName: string
  email: string
  phone: string
  address: string
  imageAvatar: string
  idRole: {
    id: number
    code: string
    name: string
  }
  status: "ACTIVE" | "IN_ACTIVE"  // Xác định rõ kiểu của status
  gender: boolean
  birthDate: string | null
}
