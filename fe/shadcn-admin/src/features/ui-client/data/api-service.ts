import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080'

export const getHome = async () => {
  try {
    const response = await axios.get(API_BASE_URL)
    return response.data
  } catch (error) {
    console.log('error home:', error)
    throw error
  }
}

export const getProductDetail = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching product-details:', error)
    throw error
  }
}
