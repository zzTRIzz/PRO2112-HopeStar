import { BillDetailSchema, BillSchema, ImeiSoldSchema } from "@/features/banhang/service/Schema";
import axios from "axios";
import { BillHistoryRequest, UpdateCustomerRequest } from "./Schema";
import Cookies from "js-cookie";

const API_BASE_URL = 'http://localhost:8080/api/admin/banhang';

export const getAllBill = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getAllBill`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Tìm kiếm bill
export const findBill = async (idBill: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getByBill/${idBill}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Cập nhật trạng thái 
export const updateStatus = async (idBill: number, status: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/updateStatus/${idBill}/${status}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Lấy dữ liệu data của product
export const getByIdBillDetail = async (id: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

//  Thêm sản phẩm vào hóa đơn
export const addHDCT = async (billDetail: BillDetailSchema) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/addHDCT`, billDetail);
        return response.data;
    } catch (error) {
        console.error('Error add san pham data:', error);
        throw error;
    }
}

// Tìm kiếm khách hàng theo  bill
export const findKhachHang = async (idBill: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/findByAccount/${idBill}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Lấy dữ liệu data của product detail
export const getProductDetail = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/product_detail`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
// Xoa san pham chi tiet trong hoa don
export const deleteProduct = async (idBillDetail: number, idBill: number) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/deleteBillDetail/${idBillDetail}/${idBill}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
// Lấy dữ liệu data của imei chua ban
export const getImei = async (idProductDetail: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/imei/${idProductDetail}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
// Tìm kiếm Imei theo idProductDetail
export const findImeiById = async (idProductDetail: number, idBillDetail: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/findImeiById/${idProductDetail}/${idBillDetail}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
// Tìm kiếm Imei theo idProductDetail
export const findImeiByIdProductDaBan = async (idProductDetail: number, idBillDetail: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/findImeiByIdProductDetailDaBan/${idProductDetail}/${idBillDetail}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}


//  Thêm sản phẩm imei vào hóa đơn
export const createImeiSold = async (imeiSold: ImeiSoldSchema,
    idBill: number,
    idProduct: number
) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/create_imei_sold/${idBill}/${idProduct}`, imeiSold);
        return response.data;
    } catch (error) {
        console.error('Error add imei sold data:', error);
        throw error;
    }
}

//  Cap nhat imei vào hóa đơn
export const updateImeiSold = async (imeiSold: ImeiSoldSchema,
    idBill: number,
    idProduct: number
) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/update-xac-nhan-imei/${idBill}/${idProduct}`, imeiSold);
        return response.data;
    } catch (error) {
        console.error('Error add imei sold data:', error);
        throw error;
    }
}

// Thanh toán hóa đơn 
export const thanhToan = async (bill: BillSchema) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/thanh_toan`, bill);
        return response.data;
    } catch (error) {
        console.error('Error them hoa don data:', error);
        throw error;
    }
};

export const updateTotalDue = async (idBill: number, totalDue: number) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/update-totalDue/${idBill}/${totalDue}`);
        return response.data;
    } catch (error) {
        console.error('Error them hoa don data:', error);
        throw error;
    }
};


// Lấy mã voucher đang sử dụng 
export const getVoucherDangSuDung = async (idBillHienTai: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/findByVoucher/${idBillHienTai}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
export const updateCustomerRequest = async (updateCustomer: UpdateCustomerRequest) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/updateCustomer`, updateCustomer);
        return response.data;
    } catch (error) {
        console.error('Error them hoa don data:', error);
        throw error;
    }
};

export const huyHoaDon = async (idBillCanHuy: number, note: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/huyHoaDon/${idBillCanHuy}`, note);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const addBillHistory = async (billHistory: BillHistoryRequest) => {
    try {
        const jwt = Cookies.get('jwt')
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
