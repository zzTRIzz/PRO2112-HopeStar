import axios from 'axios'
import { Login } from './schema'

const API_BASE_URL = 'http://localhost:8080'

export const login = async (login: Login) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signing`, login,{withCredentials: true,})
    console.log('Dữ liệu phản hồi:', response.data) // Log response data
    return response.data
  } catch (error) {
    console.error('Lỗi khi đăng nhap:', error) // Error logging
    throw error
  }
}
