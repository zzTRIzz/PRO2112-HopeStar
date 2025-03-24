import axios from 'axios'
import Cookies from 'js-cookie'
import { accountResponseSchema } from './schema'

const API_BASE_URL = 'http://localhost:8080'

export const getProfile = async () => {
  const jwt = Cookies.get('jwt')
  if (!jwt) throw new Error('No JWT token found')

  const response = await axios.get(`${API_BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
  return accountResponseSchema.parse(response.data)
}

// export const getCartItems = async () => {
//   const jwt = Cookies.get('jwt')
//   if (!jwt) return []

//   const response = await axios.get(`${API_BASE_URL}/cart`, {
//     headers: {
//       Authorization: `Bearer ${jwt}`,
//     },
//   })
//   return response.data?.items || []
// }

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
