import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const getVouchers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/voucher`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const searchVoucherByCode = async (code: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/voucher/search`, {
      params: { code }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching by code:', error);
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

    const response = await axios.get(`${API_BASE_URL}/admin/voucher/date`, {
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

    const response = await axios.get(`${API_BASE_URL}/admin/voucher/date`, {
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

    const response = await axios.get(`${API_BASE_URL}/admin/voucher/searchByCodeAndDate`, {
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

// Thêm interface Role
interface Role {
    id: number;
    code: string;
    name: string;
}

// Thêm interface ResponseData
interface ResponseData<T> {
    status: number;
    message: string;
    data: T;
}

// Cập nhật lại interface Account
interface Account {
    id: number;
    fullName: string;
    code: string;
    email: string;
    phone?: string;
    address?: string;
    imageAvatar?: string;
    status: string;
    idRole: {
        id: number;
        code: string;
        name: string;
    };
}

// Sửa lại function getAccounts
export const getAccounts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/account/list-khach-hang`);
        console.log('API Response:', response.data);

        // Kiểm tra và lọc dữ liệu
        if (response.data && response.data.data) {
            return response.data.data.filter((account: Account) => 
                account.status === 'ACTIVE'
            );
        }

        throw new Error('Invalid response format');
    } catch (error) {
        console.error('Error in getAccounts:', error);
        throw new Error('Không thể tải danh sách khách hàng');
    }
};

// Cập nhật hàm assignVoucherToAccounts
export const assignVoucherToAccounts = async (voucherId: number, customerIds: number[]) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/admin/voucher/assign`, {
            voucherId,
            customerIds
        });
        return response.data;
    } catch (error: any) {
        console.error('Error assigning voucher:', error);
        throw error;
    }
};