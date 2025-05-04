import axios from 'axios'
import { ProductDetailResponse, ProductDetailUpdate } from './schema'
import {ProductImeiRequest} from '../../../product-management/product/data/schema'
import Cookies from 'js-cookie'

const API_BASE_URL = 'http://localhost:8080/api/admin/product-detail'

export const updateStatus = async (productDetail: ProductDetailResponse) => {
  const jwt = Cookies.get('jwt')
  try {
    console.log("jwt", jwt)
    const response = await axios.patch(`${API_BASE_URL}/${productDetail.id}`,productDetail,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
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
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, data,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra')
  }
}

export const addQuantityProductDetail = async (
  id: number,
  data: ProductImeiRequest[]
) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.post(`${API_BASE_URL}/quantity/${id}`, data,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra')
  }
}

export const importExcelProductDetail = async (idProduct: number, file: File) => {
  const jwt = Cookies.get('jwt'); // Lấy JWT từ cookie
  const formData = new FormData();
  formData.append('idProduct', idProduct.toString());
  formData.append('file', file);

  try {
    const response = await axios.post(
      'http://localhost:8080/api/admin/product-detail/import-excel',
      formData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi tải file');
  }
};
