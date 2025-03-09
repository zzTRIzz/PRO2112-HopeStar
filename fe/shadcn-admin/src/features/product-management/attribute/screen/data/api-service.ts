import { Screen } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getScreen = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/screen`);
    return response.data;
  } catch (error) {
    console.error('Error fetching screens:', error);
    throw error;
  }
};

export const addScreen = async (screen: Screen) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/screen`, screen);
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data.message === 'screen type already exists') {
      throw new Error(`Screen type "${screen.type}" already exists`);
    }
    throw error;
  }
};

export const updateScreen = async (screen: Screen) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/screen/${screen.id}`, screen);
    return response.data;
  } catch (error: any) {
    if (error.response?.data.message === 'screen type already exists') {
      throw new Error(`Screen type "${screen.type}" already exists`);
    }
    throw error;
  }
};
