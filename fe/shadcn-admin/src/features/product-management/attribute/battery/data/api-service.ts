import axios from 'axios';
import type { Battery } from './schema';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8080/api/admin';

export const getBattery = async () => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.get(`${API_BASE_URL}/battery`,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching batteries:', error);
    throw error;
  }
};

export const addBattery = async (battery: Battery) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.post(`${API_BASE_URL}/battery`, 
      battery,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error adding battery:', error.response?.data);
    throw error;
  }
};

export const updateBattery = async (battery: Battery) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.put(`${API_BASE_URL}/battery/${battery.id}`,battery, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating battery:', error.response?.data);
    throw error;
  }
};
