import { Category } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getCategory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categorys:', error);
    throw error;
  }
};


export const addCategory = async (category: Category) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/category`, category);
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data.message === 'category name already exists') {
      throw new Error(`Category name "${category.name}" already exists`);
    }
    throw error;
  }
};

export const updateCategory = async (category: Category) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/category/${category.id}`, category);
    return response.data;
  } catch (error: any) {
    if (error.response?.data.message === 'category name already exists') {
      throw new Error(`Category name "${category.name}" already exists`);
    }
    throw error;
  }
};
