import axios from 'axios'
import { ProductDetailResponse, ProductDetailUpdate } from './schema'
import {ProductImeiRequest} from '../../../product-management/product/data/schema'

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

export const addQuantityProductDetail = async (
  id: number,
  data: ProductImeiRequest[]
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quantity/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra')
  }
}
