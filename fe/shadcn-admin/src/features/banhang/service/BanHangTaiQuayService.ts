import axios from 'axios';
import { BillSchema } from './BillSchema';
import { BillDetailSchema } from './BillDetailSchema';

const API_BASE_URL = 'http://localhost:8080/api/admin/banhang';

export const getData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}


export const getByIdBillDetail = async (id: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// export const addHoaDon = async (bill :BillSchema) => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/addHoaDon`, bill);
//         return response.data;
//     } catch (error) {
//         console.error('Error them hoa don  data:', error);
//         throw error;
//     }
// }
export const addHoaDon = async (bill: { idNhanVien: number }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/addHoaDon`, bill);
        return response.data;
    } catch (error) {
        console.error('Error them hoa don data:', error);
        throw error;
    }
};

export const addHDCT = async (billDetail :BillDetailSchema) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/addHDCT`, billDetail);
        return response.data;
    } catch (error) {
        console.error('Error add san pham data:', error);
        throw error;
    }
}
