import axios from 'axios';

import { BillDetailSchema, BillSchema, ImeiSoldSchema } from './Schema';
import Cookies from 'js-cookie';
import { fromThatBai } from '../components/components_con/ThongBao';
import { BillHistoryRequest } from '@/features/hoadon/service/Schema';

const API_BASE_URL = 'http://localhost:8080/api/admin/banhang';

// Lấy dữ liệu data top 5 của bill
export const getData = async () => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.get(`${API_BASE_URL}`, {
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

// Lấy dữ liệu data cho thanh toan của bill
export const getDataChoThanhToan = async () => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.get(`${API_BASE_URL}/listBill`, {
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

// Thêm hóa đơn vào cơ sở dữ liệu
export const addHoaDon = async () => {
    const jwt = Cookies.get('jwt')
    try {
        if (!jwt) throw new Error('Nhân viên chưa đăng nhập');
        const response = await axios.post(
            `${API_BASE_URL}/addHoaDon`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );

        return response.data
    } catch (error) {
        console.error('Error them hoa don data:', error);
        throw error;
    }
};

// export const addHDCT = async (billDetail: BillDetailSchema) => {
//     const jwt = Cookies.get('jwt');

//     try {
//         const response = await axios.post(`${API_BASE_URL}/addHDCT`, billDetail, {
//             headers: {
//                 Authorization: `Bearer ${jwt}`,
//             },
//         });

//         if (!response.data) {
//             fromThatBai('Không có dữ liệu trả về từ server');
//         }

//         return response.data;

//     } catch (error: any) {
//         console.error('Lỗi khi thêm sản phẩm vào hoá đơn:', error);

//         if (error.response && error.response.data) {
//             const message = 'Sản phẩm chi tiết đã hết hàng !';
//             fromThatBai(message);
//         } else {
//             fromThatBai('Không thể kết nối đến server');
//         }

//         // Nếu bạn muốn ngừng xử lý tiếp sau khi lỗi xảy ra, có thể throw tiếp hoặc return null
//         throw error; // hoặc return null;
//     }
// };

// Cập nhật khách hàng vào hóa đơn
export const addKhachHang = async (idBill: number, idAccount: number) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.put(`${API_BASE_URL}/addKhachHang`, null, {
            params: {
                idBill: idBill,
                idAccount: idAccount
            },
            headers: {
                Authorization: `Bearer ${jwt}`,
            }
        });
        return response.data;
    } catch (error: any) {
        // console.error('Lỗi khi thêm khách hàng:', error);

        if (error.response && error.response.data) {
            const message = error.response.data.message || 'Tài khoản khách hàng đã bị khóa !';
            fromThatBai(message);
        } else {
            fromThatBai('Không thể kết nối đến server');
        }
        // Ném lại lỗi nếu cần
        throw error;
    }
};



export const updateVoucher = async (idBill: number, idVoucher: number | null) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.post(`${API_BASE_URL}/updateVoucher`, null, {
            params: {
                idBill,
                idVoucher
            },
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi thêm voucher:', error);

        if (error.response && error.response.data) {
            const message = error.response.data.message || 'Thêm voucher bị lỗi !';
            fromThatBai(message);
        } else {
            fromThatBai('Không thể kết nối đến server');
        }
        throw error;
    }
};

// Tìm kiếm khách hàng theo  bill
export const findKhachHang = async (idBill: number) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.get(`${API_BASE_URL}/findByAccount/${idBill}`, {
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

// Lấy dữ liệu data của product detail
interface SearchProductRequest {
    key?: string
    idChip?: number
    idBrand?: number
    idScreen?: number
    idOs?: number
    idCategory?: number

}

export const getProductDetail = async (
    searchProductRequest?: SearchProductRequest
) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.get(`${API_BASE_URL}/product_detail`, {
            params: searchProductRequest,
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

// Lấy dữ liệu data của getAccountKhachHang
export const getAccountKhachHang = async () => {
    const jwt = Cookies.get('jwt')

    try {
        const response = await axios.get(`${API_BASE_URL}/account`, {
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


//  Thêm sản phẩm imei vào hóa đơn
// export const createImeiSold = async (imeiSold: ImeiSoldSchema,
//     idBill: number,
//     idProduct: number
// ) => {
//     const jwt = Cookies.get('jwt')
//     try {
//         const response = await axios.post(`${API_BASE_URL}/create_imei_sold/${idBill}/${idProduct}`, imeiSold, {
//             headers: {
//                 Authorization: `Bearer ${jwt}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error add imei sold data:', error);
//         throw error;
//     }
// }
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
            fromThatBai(message);
        } else {
            fromThatBai('Không thể kết nối đến server');
        }
        // Ném lại lỗi nếu cần
        throw error;
    }
};




//  Cap nhat imei vào hóa đơn
export const updateImeiSold = async (imeiSold: ImeiSoldSchema,
    idBill: number,
    idProduct: number
) => {
    const jwt = Cookies.get('jwt')
    if (!imeiSold || !idBill || !idProduct) {
        console.error('Dữ liệu không hợp lệ:', { imeiSold, idBill, idProduct });
        throw new Error('Dữ liệu không hợp lệ');
    }
    try {
        const response = await axios.post(`${API_BASE_URL}/update_imei_sold/${idBill}/${idProduct}`, imeiSold, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi thêm IMEI đã bán:', error);

        if (error.response && error.response.data) {
            const message = error.response.data.message|| 'Imei đã bán. Vui lòng chọn imei khác !';
            fromThatBai(message);
        } else {
            fromThatBai('Không thể kết nối đến server');
        }
        throw error;
    }
};

// Thêm hóa đơn vào cơ sở dữ liệu
export const thanhToan = async (bill: BillSchema) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.put(`${API_BASE_URL}/thanh_toan`, bill, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    }  catch (error: any) {
        console.error('Lỗi khi thanh toán:', error);

        if (error.response && error.response.data) {
            const message = error.response.data.message|| 'Thanh toán thất bại !';
            fromThatBai(message);
        } else {
            fromThatBai('Không thể kết nối đến server');
        }
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

// Lấy dữ liệu data của vocher theo account
export const findVoucherByAccount = async (idAccount?: number) => {
    const jwt = Cookies.get('jwt')
    try {
        const url = idAccount
            ? `${API_BASE_URL}/voucher?idAccount=${idAccount}`
            : `${API_BASE_URL}/voucher`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching vouchers:", error);
        throw error;
    }
};


export const huyHoaDon = async (idBillCanHuy: number) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.post(`${API_BASE_URL}/huyHoaDon/${idBillCanHuy}`, { idBillCanHuy }, {
            headers: {
                Authorization: `Bearer ${jwt}`
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Quét barcode để lấy sản phẩm chi tiết 
export const quetBarCode = async (barCode: String) => {
    const jwt = Cookies.get('jwt')
    try {
        const response = await axios.get(`${API_BASE_URL}/product-detail/barcode/${barCode}`, {
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
