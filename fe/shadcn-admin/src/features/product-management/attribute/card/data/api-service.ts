import { Card } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getCard = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/card`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

export const addCard = async (card: Card) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/card`, card);
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data.message === 'card type already exists') {
      throw new Error(`Card type "${card.type}" already exists`);
    }
    throw error;
  }
};

export const getCardActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/card/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batteries:', error);
    throw error;
  }
};

export const updateCard = async (card: Card) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/card/${card.id}`, card);
    return response.data;
  } catch (error: any) {
    if (error.response?.data.message === 'card type already exists') {
      throw new Error(`Card type "${card.type}" already exists`);
    }
    throw error;
  }
};
