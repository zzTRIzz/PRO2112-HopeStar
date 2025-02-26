import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};