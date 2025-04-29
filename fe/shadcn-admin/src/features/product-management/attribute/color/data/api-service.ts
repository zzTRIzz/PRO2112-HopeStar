import Cookies from 'js-cookie';
import { Color } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin';

export const getColor = async () => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.get(`${API_BASE_URL}/color`,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching colors:', error);
    throw error;
  }
};



export const addColor = async (color: Color) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.post(`${API_BASE_URL}/color`, {
      name: color.name,
      description: color.description,
      hex: color.hex,
      status: color.status
    },{
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

export const updateColor = async (color: Color) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.put(`${API_BASE_URL}/color/${color.id}`, {
      name: color.name,
      description: color.description,
      hex: color.hex,
      status: color.status
    },{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating color:', error.response?.data);
    throw error;
  }
};
