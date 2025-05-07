import { BillDetailSchema, ImeiSoldSchema } from "@/features/banhang/service/Schema";
import axios from "axios";
import { BillHistoryRequest, UpdateCustomerRequest } from "./Schema";
import Cookies from "js-cookie";
import { showErrorToast } from "../Chitiethoadon/components/components_con/ThongBao";

const API_BASE_URL = 'http://localhost:8080/api/admin/banhang';


export const getAllBill = async () => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.get(`${API_BASE_URL}/getAllBill`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Tìm kiếm bill
export const findBill = async (idBill: number) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.get(`${API_BASE_URL}/getByBill/${idBill}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Cập nhật trạng thái 
export const updateStatus = async (idBill: number, status: string) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.get(`${API_BASE_URL}/updateStatus/${idBill}/${status}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Lấy dữ liệu data của product
export const getByIdBillDetail = async (id: number) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

//  Thêm sản phẩm vào hóa đơn
export const addHDCT = async (billDetail: BillDetailSchema) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.post(`${API_BASE_URL}/addHDCT`, billDetail, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error add san pham data:', error);
        throw error;
    }
}

// Tìm kiếm khách hàng theo  bill
// export const findKhachHang = async (idBill: number) => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/findByAccount/${idBill}`,{
//             headers: {
//                 Authorization: `Bearer ${jwt}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// }

// Lấy dữ liệu data của product detail
export const getProductDetail = async () => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.get(`${API_BASE_URL}/product_detail`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
// Xoa san pham chi tiet trong hoa don
export const deleteProduct = async (idBillDetail: number, idBill: number) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.delete(`${API_BASE_URL}/deleteBillDetail/${idBillDetail}/${idBill}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
// Lấy dữ liệu data của imei chua ban
export const getImei = async (idProductDetail: number) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.get(`${API_BASE_URL}/imei/${idProductDetail}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
// Tìm kiếm Imei theo idProductDetail
export const findImeiById = async (idProductDetail: number, idBillDetail: number) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.get(`${API_BASE_URL}/findImeiById/${idProductDetail}/${idBillDetail}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
// Tìm kiếm Imei theo idProductDetail
export const findImeiByIdProductDaBan = async (idProductDetail: number, idBillDetail: number) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.get(`${API_BASE_URL}/findImeiByIdProductDetailDaBan/${idProductDetail}/${idBillDetail}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}


export const addBillDetailAndCreateImeiSold = async (billDetail: BillDetailSchema) => {
    const jwt = Cookies.get('jwt');
    try {
        const response = await axios.post(`${API_BASE_URL}/add-bill-detail-and-create-imei-sold`, billDetail, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });

        return response.data;

    } catch (error: any) {
        console.error('Lỗi khi thêm IMEI đã bán:', error);

        if (error.response && error.response.data) {
            const message = error.response.data.message|| 'Thêm sản phẩm chi tiết thất bại  !';
            showErrorToast(message);
        } else {
            showErrorToast('Không thể kết nối đến server');
        }
        // Ném lại lỗi nếu cần
        throw error;
    }
};

export const updateImeiSold = async (imeiSold: ImeiSoldSchema,
    idBill: number,
    idProduct: number
) => {
    const jwt = Cookies.get('jwt')
    if (!imeiSold || !idBill || !idProduct) {
        console.error('Dữ liệu không hợp lệ:', { imeiSold, idBill, idProduct });
        throw new Error('Dữ liệu không hợp lệ');
    }
    // console.log('imeiSold:', imeiSold);
    // console.log('idBill:', idBill);
    // console.log('idProduct:', idProduct);
    try {
        const response = await axios.post(`${API_BASE_URL}/update-xac-nhan-imei/${idBill}/${idProduct}`, imeiSold, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi thêm IMEI đã bán:', error);

        if (error.response && error.response.data) {
            const message = error.response.data.message || 'Imei đã bán. Vui lòng chọn imei khác !';
            // const message = error.response.data.message || 'Imei đã bán !';
            showErrorToast(message);
        } else {
            showErrorToast('Không thể kết nối đến server');
        }
        // Ném lại lỗi nếu cần
        throw error;
    }
};

export const updateTotalDue = async (id: number, totalDue: number) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.put(`${API_BASE_URL}/update-totalDue/${id}/${totalDue}`, { id, totalDue }, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error them hoa don data:', error);
        throw error;
    }
};


// Lấy mã voucher đang sử dụng 
export const getVoucherDangSuDung = async (idBillHienTai: number) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.get(`${API_BASE_URL}/findByVoucher/${idBillHienTai}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
export const updateCustomerRequest = async (updateCustomer: UpdateCustomerRequest) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.put(`${API_BASE_URL}/updateCustomer`, updateCustomer, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error them hoa don data:', error);
        throw error;
    }
};

export const huyHoaDon = async (idBillCanHuy: number, note: string) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.post(`${API_BASE_URL}/huyHoaDon/${idBillCanHuy}`, note, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const addBillHistory = async (billHistory: BillHistoryRequest) => {
    const jwt = Cookies.get('jwt')
    try {
        if (!jwt) throw new Error('Nhân viên chưa đăng nhập');
        const response = await axios.post(
            `http://localhost:8080/api/admin/bill/addBillHistory`,
            billHistory,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error them hoa don data:', error);
        throw error;
    }
};
