import { Chip } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getChip = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chip`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chips:', error);
    throw error;
  }
};

export const getChipActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chip/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batteries:', error);
    throw error;
  }
};

export const addChip = async (chip: Chip) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chip`, chip);
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data.message === 'chip name already exists') {
      throw new Error(`Chip name "${chip.name}" already exists`);
    }
    throw error;
  }
};

export const updateChip = async (chip: Chip) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/chip/${chip.id}`, chip);
    return response.data;
  } catch (error: any) {
    if (error.response?.data.message === 'chip name already exists') {
      throw new Error(`Chip name "${chip.name}" already exists`);
    }
    throw error;
  }
};
