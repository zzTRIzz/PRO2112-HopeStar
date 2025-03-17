import { Rom } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getRom = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rom`);
    return response.data;
  } catch (error) {
    console.error('Error fetching roms:', error);
    throw error;
  }
};

export const getRomActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rom/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batteries:', error);
    throw error;
  }
};

export const addRom = async (rom: Rom) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/rom`, rom);
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data.message === 'rom capacity already exists') {
      throw new Error(`Rom capacity "${rom.capacity}" already exists`);
    }
    throw error;
  }
};

export const updateRom = async (rom: Rom) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/rom/${rom.id}`, rom);
    return response.data;
  } catch (error: any) {
    if (error.response?.data.message === 'rom capacity already exists') {
      throw new Error(`Rom capacity "${rom.capacity}" already exists`);
    }
    throw error;
  }
};
