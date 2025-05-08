import axios from 'axios';
import { ImeiRequest } from './schema';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getImei = async () => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.get(`${API_BASE_URL}/imei`,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching imeis:', error);
    throw error;
  }
};



export const updateImei = async (id: number, imei: ImeiRequest) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.post(`${API_BASE_URL}/imei?id=${id}`, imei, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật IMEI');
  }
};
