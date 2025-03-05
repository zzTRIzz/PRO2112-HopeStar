import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

export const getVouchers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/voucher`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const searchVoucherByCode = async (code: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/voucher/search`, {
      params: { code }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching vouchers:', error);
    throw error;
  }
};

export const searchVoucherByDate = async (startTime: string, endTime: string) => {
  try {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const formattedStartTime = formatDate(startTime);
    const formattedEndTime = formatDate(endTime);

    console.log('Sending dates:', { formattedStartTime, formattedEndTime }); // Debug log

    const response = await axios.get(`${API_BASE_URL}/voucher/date`, {
      params: {
        startTime: formattedStartTime,
        endTime: formattedEndTime
      }
    });
    
    return response.data;
  } catch (error: any) {
    // Improved error handling
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi tìm kiếm');
    }
    throw error;
  }
};