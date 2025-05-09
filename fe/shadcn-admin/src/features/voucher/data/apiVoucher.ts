import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8080/api/admin'; // Thay thế bằng URL của back-end Java của bạn

// Add axios interceptor for global error handling
axios.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        const message = error.response?.data?.message || 'Có lỗi xảy ra';
        toast.error(message);
        return Promise.reject(error);
    }
);

// First, create an authenticated axios instance
const authAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to inject JWT token
authAxios.interceptors.request.use(
    (config) => {
        const jwt = Cookies.get('jwt');
        if (jwt) {
            config.headers.Authorization = `Bearer ${jwt}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Update all API calls to use authAxios
export const getVouchers = async () => {
    try {
        const response = await authAxios.get('/voucher/list');
        return response.data || [];
    } catch (error) {
        console.error('Error fetching vouchers:', error);
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || 'Không thể tải danh sách voucher');
        }
        return [];
    }
};

// Add interface for search params
interface VoucherSearchParams {
    keyword?: string;
    startTime?: string;
    endTime?: string;
    isPrivate?: boolean;
    status?: VoucherStatus; // Sửa từ StatusType thành VoucherStatus
}

// Update searchVouchers function
export const searchVouchers = async (params: VoucherSearchParams) => {
    try {
        const formatDate = (dateString: string) => {
            if (!dateString) return undefined;
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        // Filter out undefined and empty values
        const queryParams: Record<string, any> = {};
        
        if (params.keyword?.trim()) queryParams.keyword = params.keyword.trim();
        if (params.startTime) queryParams.startTime = formatDate(params.startTime);
        if (params.endTime) queryParams.endTime = formatDate(params.endTime);
        if (params.isPrivate !== undefined) queryParams.isPrivate = params.isPrivate;
        if (params.status) queryParams.status = params.status;

        console.log("Search params:", queryParams);

        const response = await authAxios.get('/voucher/searchWithFilters', {
            params: queryParams
        });

        return response.data || [];
    } catch (error) {
        console.error('Error searching vouchers:', error);
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tìm kiếm');
        }
        return [];
    }
};

export const checkVoucherCode = async (code: string, excludeId?: number): Promise<boolean> => {
  try {
    const response = await authAxios.get('/admin/voucher/check-code', {
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

// interface EmailRequest {
//     to: string;
//     subject: string;
//     content: string;
// }

// interface RoleResponse {
//     id: number;
//     name: string;
// }

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

// interface VoucherResponse {
//     id: number;
//     code: string;
//     name: string;
//     conditionPriceMin: BigDecimal;
//     conditionPriceMax: BigDecimal;
//     discountValue: BigDecimal;
//     maxDiscountAmount: BigDecimal;
//     voucherType: boolean;
//     quantity: number;
//     startTime: string;
//     endTime: string;
//     status: VoucherStatus; // Sửa kiểu từ string sang VoucherStatus
//     moTa: string;
//     isPrivate: boolean;
//     isApply: boolean;     // Thêm trường này
// }

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
        const response = await authAxios.post('/voucher/assign', {
            voucherId,
            customerIds: customers.map(customer => customer.id)
        });
        
        // Refresh voucher usage statuses after assignment
        await getVoucherUsageStatuses(voucherId);
        
        return response.data;
    } catch (error) {
        console.error('Error assigning voucher:', error);
        throw error;
    }
};

// const generateEmailContent = (customer: AccountResponse, voucher: VoucherResponse): string => {
//     return `
//         <div style="font-family: Arial, sans-serif;">
//             <h2>Xin chào ${customer.fullName}!</h2>
//             <p>Bạn vừa được thêm một voucher mới vào tài khoản của mình.</p>
//             <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
//                 <p><strong>Chi tiết voucher:</strong></p>
//                 <ul style="list-style: none; padding-left: 0;">
//                     <li><strong>Mã voucher:</strong> ${voucher.code}</li>
//                     <li><strong>Tên voucher:</strong> ${voucher.name}</li>
//                     <li><strong>Giá trị:</strong> ${formatCurrency(voucher.discountValue)}${voucher.voucherType ? '%' : 'đ'}</li>
//                     <li><strong>Điều kiện áp dụng:</strong> Đơn hàng từ ${formatCurrency(voucher.conditionPriceMin)}đ</li>
//                     <li><strong>Thời hạn sử dụng:</strong> ${formatDateTime(voucher.startTime)} - ${formatDateTime(voucher.endTime)}</li>
//                 </ul>
//             </div>
//             <p>Hãy sử dụng voucher này cho đơn hàng tiếp theo của bạn!</p>
//             <p style="margin-top: 20px;">Trân trọng,<br>HopeStar</p>
//         </div>
//     `;
// };

// Helper functions
// const formatCurrency = (value: number | string | BigDecimal): string => {
//     const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
//     return new Intl.NumberFormat('vi-VN').format(numValue);
// };

// const formatDateTime = (dateStr: string): string => {
//     if (!dateStr) return 'Không xác định';
//     try {
//         const date = new Date(dateStr);
//         if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
        
//         return new Intl.DateTimeFormat('vi-VN', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric'
//         }).format(date);
//     } catch (error) {
//         console.error('Lỗi format ngày:', error);
//         return 'Ngày không hợp lệ';
//     }
// };

// Type definition for BigDecimal from Java
// type BigDecimal = {
//     toString(): string;
// } | number | string;  // Thêm string vào union type

// Add a new function to get only customers (role_4)
export const getCustomers = async (): Promise<AccountResponse[]> => {
  try {
      // Update API endpoint to match your backend controller
      const response = await authAxios.get('/account/list');
      
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

// Add export for types
export type { VoucherSearchParams };

// Remove unused functions
export const searchVoucherByCode = undefined;
export const searchVoucherByDate = undefined;

// Add new enums and interfaces for voucher account status
export enum VoucherAccountStatus {
    NOT_USED = "NOT_USED",
    USED = "USED",
    EXPIRED = "EXPIRED"
}

// Add function to check voucher status and determine account status
export const determineVoucherAccountStatus = (voucherStatus: VoucherStatus): VoucherAccountStatus | null => {
    switch (voucherStatus) {
        case VoucherStatus.ACTIVE:
            return VoucherAccountStatus.NOT_USED;
        case VoucherStatus.EXPIRED:
            return VoucherAccountStatus.EXPIRED;
        default:
            return null;
    }
};

interface VoucherAccountResponse {
    id: number;
    voucherId: number;
    accountId: number;
    status: VoucherAccountStatus;
    usedDate?: string;
}

// Add new function to get voucher usage status
export const getVoucherUsageStatus = async (voucherId: number, accountId: number): Promise<VoucherAccountResponse | null> => {
    try {
        const response = await authAxios.get('/voucher-account/status', {
            params: {
                voucherId,
                accountId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting voucher usage status:', error);
        return null;
    }
};

// Add new function to update voucher account status
export const updateVoucherAccountStatus = async (
    id: number, 
    status: VoucherAccountStatus
): Promise<VoucherAccountResponse> => {
    try {
        const response = await authAxios.put(
            `/admin/voucher-account/${id}/status`,
            null,
            { params: { status } }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating voucher account status:', error);
        throw error;
    }
};

// Thêm function để lấy trạng thái sử dụng voucher
export const getVoucherUsageStatuses = async (voucherId: number): Promise<VoucherAccountResponse[]> => {
    try {
        const response = await authAxios.get(`/voucher/${voucherId}/usage-status`);
        
        // Get voucher details to check status
        const voucherResponse = await authAxios.get(`/voucher/detail/${voucherId}`);
        const voucher = voucherResponse.data;
        
        // Map response and update statuses based on voucher status
        return response.data.map((status: VoucherAccountResponse) => {
            if (voucher.status === VoucherStatus.EXPIRED) {
                return {...status, status: VoucherAccountStatus.EXPIRED};
            }
            if (voucher.status !== VoucherStatus.ACTIVE && status.status === VoucherAccountStatus.NOT_USED) {
                return {...status, status: null};
            }
            return status;
        });
    } catch (error) {
        console.error('Error getting voucher usage statuses:', error);
        return [];
    }
};

// Add function to auto-update expired voucher statuses
export const updateExpiredVoucherStatuses = async (voucherId: number): Promise<void> => {
    try {
        await authAxios.put(`/voucher/${voucherId}/update-expired-statuses`);
    } catch (error) {
        console.error('Error updating expired voucher statuses:', error);
    }
};

export const getAccountsVoucher = async (voucherId: number): Promise<void> => {
    try {
        await authAxios.get(`getAccountsAddVoucherByStatus/${voucherId}`);
    } catch (error) {
        console.error('Error updating expired voucher statuses:', error);
    }
};


export const getAccountDaAddVoucher = async (voucherId: number): Promise<void> => {
    try {
      const response = await authAxios.get(`/voucher/get-account-da-add-voucher/${voucherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts added to voucher:', error);
      toast.error('Không thể tải danh sách tài khoản đã thêm vào voucher');
    }
  };


export enum VoucherStatus {
    UPCOMING = "UPCOMING",
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED"
}
