import { Sim } from './schema';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getSim = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sim`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sims:', error);
    throw error;
  }
};

export const getSimActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sim/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batteries:', error);
    throw error;
  }
};

export const addSim = async (sim: Sim) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sim`, sim);
    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data.message === 'sim type already exists') {
      throw new Error(`Sim type "${sim.type}" already exists`);
    }
    throw error;
  }
};

export const updateSim = async (sim: Sim) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/sim/${sim.id}`, sim);
    return response.data;
  } catch (error: any) {
    if (error.response?.data.message === 'sim type already exists') {
      throw new Error(`Sim type "${sim.type}" already exists`);
    }
    throw error;
  }
};
