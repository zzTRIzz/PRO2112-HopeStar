import { FrontCamera } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getFrontCamera = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/front-camera`);
    return response.data;
  } catch (error) {
    console.error('Error fetching front-cameras:', error);
    throw error;
  }
};

export const addFrontCamera = async (frontCamera: FrontCamera) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/front-camera`, frontCamera);
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data.message === 'frontCamera type with resolution already exists') {
      throw new Error(`FrontCamera type "${frontCamera.type}" with "${frontCamera.resolution}" already exists`);
    }
    throw error;
  }
};

export const updateFrontCamera = async (frontCamera: FrontCamera) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/front-camera/${frontCamera.id}`, frontCamera);
    return response.data;
  } catch (error: any) {
    if (error.response?.data.message === 'frontCamera type with resolution already exists') {
      throw new Error(`FrontCamera type "${frontCamera.type}" with "${frontCamera.resolution}" already exists`);
    }
    throw error;
  }
};
