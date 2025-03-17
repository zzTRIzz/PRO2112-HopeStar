import { Brand } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getBrand = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/brand`);
    return response.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

export const getBrandActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/brand/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batteries:', error);
    throw error;
  }
};

export const addBrand = async (brand: Brand) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/brand`, brand);
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data.message === 'brand name already exists') {
      throw new Error(`Brand name "${brand.name}" already exists`);
    }
    throw error;
  }
};

export const updateBrand = async (brand: Brand) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/brand/${brand.id}`, brand);
    return response.data;
  } catch (error: any) {
    if (error.response?.data.message === 'brand name already exists') {
      throw new Error(`Brand name "${brand.name}" already exists`);
    }
    throw error;
  }
};
