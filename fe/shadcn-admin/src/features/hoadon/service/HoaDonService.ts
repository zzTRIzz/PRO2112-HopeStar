import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api/admin/banhang';

// Lấy dữ liệu data top 5 của bill
export const getAllBill = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getAllBill`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}