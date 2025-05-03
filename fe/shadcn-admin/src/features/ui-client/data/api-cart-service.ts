import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = 'http://localhost:8080/api/client'
const API_BASE_URL_GUEST = 'http://localhost:8080/guest'
export const getVoucher = async () => {
  const jwt = Cookies.get('jwt')
  if (jwt) {
    const response = await axios.get(`${API_BASE_URL}/voucher`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    return response.data.data
  } else {
    const response = await axios.get(`${API_BASE_URL_GUEST}/voucher`)
    return response.data.data
  }
}

export const getCart = async () => {
  const jwt = Cookies.get('jwt')
  if (jwt) {
    const response = await axios.get(`${API_BASE_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    return response.data.data
  } else {
    const response = await axios.get(`${API_BASE_URL_GUEST}/cart`, {
      withCredentials: true,
    })
    return response.data.data
  }
}

export const addProductToCart = async (
  idProductDetail: number,
  quantity: number
) => {
  const jwt = Cookies.get('jwt')

  if (jwt) {
    const response = await axios.post(
      `${API_BASE_URL}/add-to-cart`,
      { idProductDetail, quantity },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
    return response.data.data
  } else {
    const response = await axios.post(
      `${API_BASE_URL_GUEST}/add-to-cart`,
      { idProductDetail, quantity },
      {
        withCredentials: true,
      }
    )
    return response.data.data
  }
}

export const updateCartItem = async (itemId: number, quantity: number) => {
  const jwt = Cookies.get('jwt')
  if (jwt) {
    const response = await axios.put(
      `${API_BASE_URL}/cart-detail/update/${itemId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
    return response.data
  }
  const response = await axios.put(
    `${API_BASE_URL_GUEST}/cart-detail/update/${itemId}`,
    { quantity },
    {
      withCredentials: true,
    }
  )
  return response.data
}

export const deleteCartItem = async (itemId: number) => {
  const jwt = Cookies.get('jwt')
  if (jwt) {
    const response = await axios.delete(
      `${API_BASE_URL}/cart-detail/delete/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
    return response.data
  } else {
    const response = await axios.delete(
      `${API_BASE_URL_GUEST}/cart-detail/delete/${itemId}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  }
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
  if (jwt) {
    const response = await axios.post(
      `${API_BASE_URL}/order`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
    return response.data
  }else {
    const response = await axios.post(
      `${API_BASE_URL_GUEST}/order`,
      orderData,
      {
        withCredentials: true,
      }
    )
    return response.data
  }
}

export const checkCartDetail = async (idCartDetailList: number[]) => {
  const jwt = Cookies.get('jwt')
  if (jwt) {
    const response = await axios.post(
      `${API_BASE_URL}/cart-detail/check-product`,
      idCartDetailList,{
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
    return response.data
  }else{
  const response = await axios.post(
    `${API_BASE_URL_GUEST}/cart-detail/check-product`,
    idCartDetailList,
  )
  return response.data
}
}
