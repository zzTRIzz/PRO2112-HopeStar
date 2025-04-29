import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = 'http://localhost:8080/bill/client'

export const getBillByAccount = async () => {
    const jwt = Cookies.get('jwt')
    if (!jwt) return []
    const response = await axios.get(`${API_BASE_URL}`, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    })
    return response.data.data
}

export const getBillAllClientByAccount = async (idBill: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get-all/${idBill}`);
        return response.data
    } catch (error) {
        console.error('Error fetching bill details:', error)
        throw error
    }
}