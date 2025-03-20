import axios from "axios"
import { CustomerResponse, CustomerFormData, CustomerApiPayload } from "../types"

const API_URL = 'http://localhost:8080/api/account'

const DEFAULT_VALUES = {
  googleId: "string",
  imageAvatar: "https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144857620.jpg",
  password: "string"
}

export const khachHangService = {
  getList: async (): Promise<CustomerResponse[]> => {
    const response = await axios.get(`${API_URL}/list-khach-hang`)
    if (response.data.status === 200) {
      return response.data.data
    }
    throw new Error(response.data.message || "Failed to fetch customers")
  },

  getById: async (id: number): Promise<CustomerResponse> => {
    const response = await axios.get(`${API_URL}/get/${id}`)
    if (response.data.status === 200) {
      return response.data.data
    }
    throw new Error(response.data.message || "Failed to fetch customer")
  },

  create: async (formData: CustomerFormData): Promise<CustomerResponse> => {
    const payload: CustomerApiPayload = {
      ...formData,
      ...DEFAULT_VALUES
    }

    const response = await axios.post(`${API_URL}/add`, payload)
    if (response.data.status === 200) {
      return response.data.data
    }
    throw new Error(response.data.message || "Failed to create customer")
  },

  update: async (id: number, formData: CustomerFormData): Promise<CustomerResponse> => {
    const payload: CustomerApiPayload = {
      ...formData,
      ...DEFAULT_VALUES
    }

    const response = await axios.put(`${API_URL}/update/${id}`, payload)
    if (response.data.status === 202) {
      return response.data.data
    }
    throw new Error(response.data.message || "Failed to update customer")
  },

  updateStatus: async (id: number, status: "ACTIVE" | "IN_ACTIVE"): Promise<CustomerResponse> => {
    const currentData = await khachHangService.getById(id)
    
    const payload: CustomerApiPayload = {
      ...currentData,
      ...DEFAULT_VALUES,
      status
    }

    const response = await axios.put(`${API_URL}/update/${id}`, payload)
    if (response.data.status === 202) {
      return response.data.data
    }
    throw new Error(response.data.message || "Failed to update customer status")
  }
}
