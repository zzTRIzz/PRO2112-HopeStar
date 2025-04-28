import Cookies from 'js-cookie';
import { Category } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getCategory = async () => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.get(`${API_BASE_URL}/category`,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categorys:', error);
    throw error;
  }
};


export const addCategory = async (category: Category) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.post(`${API_BASE_URL}/category`, category,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

export const updateCategory = async (category: Category) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.put(`${API_BASE_URL}/category/${category.id}`, category,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating category:', error.response?.data);
    throw error;
  }
};
