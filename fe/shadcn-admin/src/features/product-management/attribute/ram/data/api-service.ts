import { Ram } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getRam = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ram`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rams:', error);
    throw error;
  }
};

export const addRam = async (ram: Ram) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ram`, ram);
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data.message === 'ram capacity already exists') {
      throw new Error(`Ram capacity "${ram.capacity}" already exists`);
    }
    throw error;
  }
};

export const updateRam = async (ram: Ram) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/ram/${ram.id}`, ram);
    return response.data;
  } catch (error: any) {
    if (error.response?.data.message === 'ram capacity already exists') {
      throw new Error(`Ram capacity "${ram.capacity}" already exists`);
    }
    throw error;
  }
};
