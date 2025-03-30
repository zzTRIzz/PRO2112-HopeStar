import axios from 'axios'
import { ProductDetailResponse } from './schema'

const API_BASE_URL = 'http://localhost:8080/api/admin/product-detail'
export const updateStatus = async (productDetail: ProductDetailResponse) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${productDetail.id}`)
    return response.data
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export const updateProductDetail = async (
  id: number,
  data: ProductDetailUpdate
) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra')
  }
}
