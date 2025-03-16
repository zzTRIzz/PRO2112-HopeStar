import axios from 'axios';
import { ProductConfigRequest, ProductResponse, SearchProductRequest } from './schema';
const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
// search products by SearchProductRequest
export const searchProducts = async (searchProductRequest: SearchProductRequest) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product/search`, { params: searchProductRequest });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (productData: ProductConfigRequest) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/product/create-product`, productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateStatus = async (product:ProductResponse) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/product/${product.id}`);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};