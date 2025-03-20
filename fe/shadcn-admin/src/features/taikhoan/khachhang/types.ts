export interface CustomerResponse {
  id: number
  fullName: string
  code: string
  email: string
  phone: string
  address: string
  googleId: string
  imageAvatar: string
  gender: boolean
  birthDate: string
  status: "ACTIVE" | "IN_ACTIVE"
}

export interface CustomerFormData {
  fullName: string
  email: string
  phone: string
  gender: boolean
  birthDate: string
  status: "ACTIVE" | "IN_ACTIVE"
  province: string
  district: string
  ward: string
  street: string
  address: string
}

export interface CustomerApiPayload extends Omit<CustomerFormData, "province" | "district" | "ward" | "street"> {
  googleId: string
  imageAvatar: string
  password: string
}
