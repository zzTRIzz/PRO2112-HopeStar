import { Color } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin';

export const getColor = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/color`);
    return response.data;
  } catch (error) {
    console.error('Error fetching colors:', error);
    throw error;
  }
};

export const getColorActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/color/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batteries:', error);
    throw error;
  }
};

export const addColor = async (color: Color) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/color`, {
      name: color.name,
      description: color.description,
      hex: color.hex,
      status: color.status
    });
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data.message === 'color name already exists') {
      throw new Error(`color name "${color.name}" already exists`);
    }
    throw error;
  }
};

export const updateColor = async (color: Color) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/color/${color.id}`, {
      name: color.name,
      description: color.description,
      hex: color.hex,
      status: color.status
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data.message === 'color name already exists') {
      throw new Error(`color name "${color.name}" already exists`);
    }
    throw error;
  }
};
