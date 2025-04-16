import axios from 'axios'
import { Signup } from './schema'

const API_BASE_URL = 'http://localhost:8080'

export const signup = async (signup: Signup) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sign-up`, signup)
    console.log('Dữ liệu phản hồi:', response.data) // Log response data
    return response.data
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error) // Error logging
    throw error
  }
}

export const forgot = async (email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
      email,
    })
    return response.data
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error) // Error logging
    throw error
  }
}

export const reset = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reset-password`, null, {
      params: {
        token,
        newPassword,
      },
    })
    return response.data
  } catch (error) {
    console.error('Lỗi khi đặt lại mật khẩu:', error)
    throw error
  }
}
