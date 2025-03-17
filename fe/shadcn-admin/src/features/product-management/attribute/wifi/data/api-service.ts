import { Wifi } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getWifi = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/wifi`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wifis:', error);
    throw error;
  }
};

export const getWifiActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/wifi/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batteries:', error);
    throw error;
  }
};

export const addWifi = async (wifi: Wifi) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/wifi`, wifi);
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data.message === 'wifi name already exists') {
      throw new Error(`Wifi name "${wifi.name}" already exists`);
    }
    throw error;
  }
};

export const updateWifi = async (wifi: Wifi) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/wifi/${wifi.id}`, wifi);
    return response.data;
  } catch (error: any) {
    if (error.response?.data.message === 'wifi name already exists') {
      throw new Error(`Wifi name "${wifi.name}" already exists`);
    }
    throw error;
  }
};
