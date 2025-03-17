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
    
    // Kiểm tra dữ liệu trả về
    if (!Array.isArray(response.data)) {
      console.error('Invalid response data:', response.data);
      return [];
    }

    // Kiểm tra cấu trúc của từng voucher
    return response.data.filter(voucher => 
      voucher && 
      typeof voucher === 'object' && 
      'code' in voucher
    );
  } catch (error: any) {
    // Improved error handling
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi tìm kiếm');
    }
    throw error;
  }
};

export const searchVoucherByDateRange = async (startTime: string, endTime: string) => {
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

    const response = await axios.get(`${API_BASE_URL}/voucher/date`, {
      params: {
        startTime: formattedStartTime,
        endTime: formattedEndTime
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const searchVoucherByCodeAndDate = async (code: string, startTime: string, endTime: string) => {
  try {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // Log để debug
    console.log('Original dates:', { startTime, endTime });

    const formattedStartTime = formatDate(startTime);
    const formattedEndTime = formatDate(endTime);

    // Log để debug
    console.log('Formatted dates:', { formattedStartTime, formattedEndTime });

    const response = await axios.get(`${API_BASE_URL}/voucher/searchByCodeAndDate`, {
      params: {
        code,
        startTime: formattedStartTime,
        endTime: formattedEndTime
      }
    });

    // Log response để debug
    console.log('API Response:', response.data);

    if (!Array.isArray(response.data)) {
      console.error('Invalid response data:', response.data);
      return [];
    }

    return response.data;
  } catch (error: any) {
    // Log chi tiết lỗi để debug
    console.error('API Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi tìm kiếm');
    }
    throw error;
  }
};