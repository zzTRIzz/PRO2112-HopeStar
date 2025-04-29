import Cookies from 'js-cookie';
import { Ram } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getRam = async () => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.get(`${API_BASE_URL}/ram`,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rams:', error);
    throw error;
  }
};


export const addRam = async (ram: Ram) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.post(`${API_BASE_URL}/ram`, ram,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    throw error;
  }
};

export const updateRam = async (ram: Ram) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.put(`${API_BASE_URL}/ram/${ram.id}`, ram,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error response:', error.response?.data);
    throw error;
  }
};
