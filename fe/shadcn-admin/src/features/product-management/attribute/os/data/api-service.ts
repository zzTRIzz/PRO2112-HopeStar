import { Os } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getOs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/os`);
    return response.data;
  } catch (error) {
    console.error('Error fetching os:', error);
    throw error;
  }
};

export const getOsActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/os/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batteries:', error);
    throw error;
  }
};

export const addOs = async (os: Os) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/os`, os);
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data.message === 'os name already exists') {
      throw new Error(`Os name "${os.name}" already exists`);
    }
    throw error;
  }
};

export const updateOs = async (os: Os) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/os/${os.id}`, os);
    return response.data;
  } catch (error: any) {
    if (error.response?.data.message === 'os name already exists') {
      throw new Error(`Os name "${os.name}" already exists`);
    }
    throw error;
  }
};
