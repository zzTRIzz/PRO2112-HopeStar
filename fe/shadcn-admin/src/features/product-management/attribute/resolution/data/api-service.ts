import { Resolution } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getResolution = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/resolution`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resolutions:', error);
    throw error;
  }
};

export const addResolution = async (resolution: Resolution) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/resolution`, resolution);
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data.message === 'resolution type already exists') {
      throw new Error(`Resolution type "${resolution.resolutionType}", height "${resolution.height}", width "${resolution.width}" already exists`);
    }
    throw error;
  }
};

export const updateResolution = async (resolution: Resolution) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/resolution/${resolution.id}`, resolution);
    return response.data;
  } catch (error: any) {
    if (error.response?.data.message === 'resolution type already exists') {
      throw new Error(`Resolution type "${resolution.resolutionType}", height "${resolution.height}", width "${resolution.width}" already exists`);
    }
    throw error;
  }
};
