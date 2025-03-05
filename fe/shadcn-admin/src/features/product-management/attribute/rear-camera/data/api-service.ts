import { RearCamera } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getRearCamera = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rear-camera`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rear-cameras:', error);
    throw error;
  }
};

export const addRearCamera = async (rearCamera: RearCamera) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/rear-camera`, rearCamera);
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data.message === 'rearCamera type with resolution already exists') {
      throw new Error(`RearCamera type "${rearCamera.type}" with "${rearCamera.resolution}" already exists`);
    }
    throw error;
  }
};

export const updateRearCamera = async (rearCamera: RearCamera) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/rear-camera/${rearCamera.id}`, rearCamera);
    return response.data;
  } catch (error: any) {
    if (error.response?.data.message === 'rearCamera type with resolution already exists') {
      throw new Error(`RearCamera type "${rearCamera.type}" with "${rearCamera.resolution}" already exists`);
    }
    throw error;
  }
};
