import axios from 'axios';
import { ImeiRequest } from './schema';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getImei = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/imei`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching imeis:', error);
    throw error;
  }
};



export const updateImei = async (imei: ImeiRequest) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/imei/${imei.id}`, imei);
    return response.data;
  } catch (error: any) {
    console.error('Error response:', error.response?.data);
    throw error;
  }
};
