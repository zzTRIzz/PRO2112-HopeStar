import Cookies from 'js-cookie';
import { Screen } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getScreen = async () => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.get(`${API_BASE_URL}/screen`,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching screens:', error);
    throw error;
  }
};


export const addScreen = async (screen: Screen) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.post(`${API_BASE_URL}/screen`, screen,{
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

export const updateScreen = async (screen: Screen) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.put(`${API_BASE_URL}/screen/${screen.id}`, screen,{
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
