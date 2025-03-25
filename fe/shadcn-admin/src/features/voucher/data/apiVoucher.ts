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

export const checkVoucherCode = async (code: string, excludeId?: number): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/voucher/check-code`, {
      params: { 
        code,
        excludeId
      }
    });
    
    console.log('Check code response:', response.data);
    // API should return true if code exists, false if it doesn't
    return response.data;
  } catch (error) {
    console.error('Error checking voucher code:', error);
    // Return true on error to prevent duplicate codes
    return true;
  }
};

interface EmailRequest {
    to: string;
    subject: string;
    content: string;
}

interface RoleResponse {
    id: number;
    name: string;
}

interface AccountResponse {
    id: number;
    fullName: string;
    code: string;
    email: string;
    phone: string;
    address: string;
    imageAvatar: string;
    idRole: {
        id: number;  // Using id instead of code
        name: string;
    };
    status: string;
    createdAt: string;
    updatedAt: string;
    birthday: string;
    // ...other fields
}

interface VoucherResponse {
    id: number;
    code: string;
    name: string;
    discountValue: BigDecimal;
    voucherType: boolean;
    conditionPriceMin: BigDecimal;
    conditionPriceMax: BigDecimal;
    quantity: number;
    startTime: string;
    endTime: string;
    status: string;
}

// Thêm interface cho response gán voucher
interface AssignVoucherResponse {
    success: boolean;
    message: string;
    details?: {
        alreadyHasVoucher: string[];
        assigned: string[];
    };
}

// Cập nhật lại function assignVoucherToCustomers
export const assignVoucherToCustomers = async (
    voucherId: number, 
    customers: AccountResponse[]
): Promise<AssignVoucherResponse> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/voucher/assign`, {
            voucherId,
            customerIds: customers.map(customer => customer.id)
        });
        
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const generateEmailContent = (customer: AccountResponse, voucher: VoucherResponse): string => {
    return `
        <div style="font-family: Arial, sans-serif;">
            <h2>Xin chào ${customer.fullName}!</h2>
            <p>Bạn vừa được thêm một voucher mới vào tài khoản của mình.</p>
            <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
                <p><strong>Chi tiết voucher:</strong></p>
                <ul style="list-style: none; padding-left: 0;">
                    <li><strong>Mã voucher:</strong> ${voucher.code}</li>
                    <li><strong>Tên voucher:</strong> ${voucher.name}</li>
                    <li><strong>Giá trị:</strong> ${formatCurrency(voucher.discountValue)}${voucher.voucherType ? '%' : 'đ'}</li>
                    <li><strong>Điều kiện áp dụng:</strong> Đơn hàng từ ${formatCurrency(voucher.conditionPriceMin)}đ</li>
                    <li><strong>Thời hạn sử dụng:</strong> ${formatDateTime(voucher.startTime)} - ${formatDateTime(voucher.endTime)}</li>
                </ul>
            </div>
            <p>Hãy sử dụng voucher này cho đơn hàng tiếp theo của bạn!</p>
            <p style="margin-top: 20px;">Trân trọng,<br>HopeStar</p>
        </div>
    `;
};

// Helper functions
const formatCurrency = (value: number | string | BigDecimal): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
    return new Intl.NumberFormat('vi-VN').format(numValue);
};

const formatDateTime = (dateStr: string): string => {
    if (!dateStr) return 'Không xác định';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
        
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    } catch (error) {
        console.error('Lỗi format ngày:', error);
        return 'Ngày không hợp lệ';
    }
};

// Type definition for BigDecimal from Java
type BigDecimal = {
    toString(): string;
} | number;

// Add a new function to get only customers (role_4)
export const getCustomers = async (): Promise<AccountResponse[]> => {
    try {
        // Update API endpoint to match your backend controller
        const response = await axios.get(`http://localhost:8080/api/account/list`);
        
        // Log the raw response for debugging
        console.log('Raw API response:', response.data);

        // Get data from ResponseData wrapper
        const data = response.data.data;
        console.log('Extracted data:', data);

        // Filter customers with role_4 and ACTIVE status
        const customers = data.filter((account: AccountResponse) => 
            account.idRole?.id === 4 && account.status === 'ACTIVE'
        );

        console.log('Filtered customers:', customers);
        return customers;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw new Error('Không thể tải danh sách khách hàng');
    }
};