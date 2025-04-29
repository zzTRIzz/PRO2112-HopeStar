import Cookies from 'js-cookie';
import { Os } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getOs = async () => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.get(`${API_BASE_URL}/os`,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching os:', error);
    throw error;
  }
};


export const addOs = async (os: Os) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.post(`${API_BASE_URL}/os`, os,{
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

export const updateOs = async (os: Os) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.put(`${API_BASE_URL}/os/${os.id}`, os,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating os:', error.response?.data);
    throw error;
  }
};
