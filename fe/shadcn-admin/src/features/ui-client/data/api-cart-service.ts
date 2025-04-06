import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = 'http://localhost:8080/api/client'

// export const getCart = async () => {
//   const jwt = Cookies.get('jwt')
//   if (!jwt) return []

//   const response = await axios.get(`${API_BASE_URL}/cart`, {
//     headers: {
//       Authorization: `Bearer ${jwt}`,
//     },
//   })
//   return response.data.data
// }

export const getCart = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart`, {
      withCredentials: true, // Quan trọng: gửi cookie tự động
      headers: {
        Authorization: Cookies.get('jwt')
          ? `Bearer ${Cookies.get('jwt')}`
          : undefined,
      },
    })
    return response.data.data
  } catch (error) {
    console.error('Error fetching cart:', error)
    return []
  }
}

export const addProductToCart = async (
  idProductDetail: number,
  quantity: number
) => {
  const jwt = Cookies.get('jwt')

  const response = await axios.post(
    `${API_BASE_URL}/add-to-cart`,
    { idProductDetail, quantity },
    {
      withCredentials: true, // Quan trọng: gửi cookie guest_cart_id tự động
      headers: {
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        'Content-Type': 'application/json',
      },
    }
  )

  return response.data
}

export const updateCartItem = async (itemId: number, quantity: number) => {
  const jwt = Cookies.get('jwt')

  const response = await axios.put(
    `${API_BASE_URL}/cart-detail/update/${itemId}`,
    { quantity },
    {
      headers: {
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        'Content-Type': 'application/json',
      },
    }
  )
  return response.data
}

export const deleteCartItem = async (itemId: number) => {
  const jwt = Cookies.get('jwt')

  const response = await axios.delete(
    `${API_BASE_URL}/cart-detail/delete/${itemId}`,
    {
      headers: {
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        'Content-Type': 'application/json',
      },
    }
  )
  return response.data
}

interface OrderData {
  customerInfo: {
    name: string
    phone: string
    email: string
  }
  location: {
    deliveryType: string
    fullAddress: string
  }
  paymentMethod: string
  eInvoice: boolean
  products: Array<{
    id: number
    productName: string
    quantity: number
    ram: string
    rom: string
    color: string
    image: string
    price: number
    priceSell: number
  }>
}

export const order = async (orderData: OrderData) => {
  const jwt = Cookies.get('jwt')

  const response = await axios.post(`${API_BASE_URL}/order`, orderData, {
    headers: {
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      'Content-Type': 'application/json',
    },
  })
  return response.data
}
