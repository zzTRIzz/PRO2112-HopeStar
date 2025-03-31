import axios from 'axios';
import { CartDetail } from './Schema';


const API_BASE_URL = 'http://localhost:8080/api/admin/giohang';
const API_BASE_URL_ACCOUNT = 'http://localhost:8080/api/account';

// lấy giỏ hàng theo account
export const getCart = async (idAccount : number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/shoppingCart/${idAccount}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
// lấy giỏ hàng  chi tiết theo account
export const getByCartDetail = async (idAccount : number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/cartDetail/${idAccount}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
// add giỏ hàng chi tiết
export const createCartDetail = async (cartDetail : CartDetail) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/addCartDetail`,cartDetail);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// lấy khách hàng theo id account
export const getByIdAccount = async (idAccount : number) => {
    try {
        const response = await axios.get(`${API_BASE_URL_ACCOUNT}/get/${idAccount}`,);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
