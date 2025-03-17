import axios from 'axios';
import type { Battery } from './schema';

const API_BASE_URL = 'http://localhost:8080/api/admin';

export const getBattery = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/battery`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batteries:', error);
    throw error;
  }
};
export const getBatteryActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/battery/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batteries:', error);
    throw error;
  }
};

export const addBattery = async (battery: Battery) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/battery`, {
      ...battery,
      capacity: Number(battery.capacity)
    });
    return response.data;
  } catch (error: any) {
    console.error('Error adding battery:', error.response?.data);
    throw error;
  }
};

export const updateBattery = async (battery: Battery) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/battery/${battery.id}`, {
      ...battery,
      capacity: Number(battery.capacity)
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating battery:', error.response?.data);
    throw error;
  }
};
