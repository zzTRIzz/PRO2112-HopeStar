import { Bluetooth } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getBluetooth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bluetooth`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bluetooths:', error);
    throw error;
  }
};



export const addBluetooth = async (bluetooth: Bluetooth) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/bluetooth`, bluetooth);
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data.message === 'bluetooth name already exists') {
      throw new Error(`Bluetooth name "${bluetooth.name}" already exists`);
    }
    throw error;
  }
};

export const updateBluetooth = async (bluetooth: Bluetooth) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/bluetooth/${bluetooth.id}`, bluetooth);
    return response.data;
  } catch (error: any) {
    if (error.response?.data.message === 'bluetooth name already exists') {
      throw new Error(`Bluetooth name "${bluetooth.name}" already exists`);
    }
    throw error;
  }
};
