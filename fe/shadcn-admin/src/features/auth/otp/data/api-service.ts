import axios from 'axios'
import { Otp } from './schema'

const API_BASE_URL = 'http://localhost:8080'

export const sentOtp = async (otpRequestSchema: Otp) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sent-otp`,
      otpRequestSchema
    )
    console.log('Dữ liệu phản hồi:', response.data) // Log response data
    return response.data
  } catch (error) {
    console.error('Lỗi khi gửi OTP:', error) // Error logging
    throw error
  }
}
