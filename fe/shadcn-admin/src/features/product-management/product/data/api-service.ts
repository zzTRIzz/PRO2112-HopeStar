import axios from 'axios'
import Cookies from 'js-cookie'
import {
  ProductConfigRequest,
  ProductResponse,
  ProductUpdate,
  SearchProductRequest,
} from './schema'

const API_BASE_URL = 'http://localhost:8080/api/admin' 

export const getProducts = async () => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.get(`${API_BASE_URL}/product`,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}
// search products by SearchProductRequest
export const searchProducts = async (
  searchProductRequest: SearchProductRequest
) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.get(`${API_BASE_URL}/product/search`, {
      params: searchProductRequest,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export const createProduct = async (productData: ProductConfigRequest) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.post(
      `${API_BASE_URL}/product/create-product`,
      productData,{
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export const updateProduct = async (
  productId: number,
  productUpdate: ProductUpdate
) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.put(
      `${API_BASE_URL}/product/${productId}`,
      productUpdate,{
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export const updateStatus = async (product: ProductResponse) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.patch(`${API_BASE_URL}/product/${product.id}`,product,{
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export const productDetailById = async (id: number) => {
  const jwt = Cookies.get('jwt')
  try {
    const response = await axios.get(
      `${API_BASE_URL}/product/${id}/product-detail`,{
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching product-details:', error)
    throw error
  }
}

// api thuoc tinh active
export const getWifiActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/wifi/active`)
    return response.data
  } catch (error) {
    console.error('Error fetching batteries:', error)
    throw error
  }
}

export const getSimActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sim/active`)
    return response.data
  } catch (error) {
    console.error('Error fetching batteries:', error)
    throw error
  }
}

export const getScreenActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/screen/active`)
    return response.data
  } catch (error) {
    console.error('Error fetching batteries:', error)
    throw error
  }
}

export const getRomActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rom/active`)
    return response.data
  } catch (error) {
    console.error('Error fetching batteries:', error)
    throw error
  }
}

export const getRearCameraActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rear-camera/active`)
    return response.data
  } catch (error) {
    console.error('Error fetching batteries:', error)
    throw error
  }
}

export const getRamActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ram/active`)
    return response.data
  } catch (error) {
    console.error('Error fetching batteries:', error)
    throw error
  }
}

export const getOsActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/os/active`)
    return response.data
  } catch (error) {
    console.error('Error fetching batteries:', error)
    throw error
  }
}

export const getFrontCameraActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/front-camera/active`)
    return response.data
  } catch (error) {
    console.error('Error fetching batteries:', error)
    throw error
  }
}

export const getColorActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/color/active`)
    return response.data
  } catch (error) {
    console.error('Error fetching batteries:', error)
    throw error
  }
}

export const getChipActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chip/active`)
    return response.data
  } catch (error) {
    console.error('Error fetching batteries:', error)
    throw error
  }
}

export const getCategoryActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category/active`)
    return response.data
  } catch (error) {
    console.error('Error fetching batteries:', error)
    throw error
  }
}

export const getCardActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/card/active`)
    return response.data
  } catch (error) {
    console.error('Error fetching batteries:', error)
    throw error
  }
}

export const getBrandActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/brand/active`)
    return response.data
  } catch (error) {
    console.error('Error fetching batteries:', error)
    throw error
  }
}

export const getBluetoothActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bluetooth/active`)
    return response.data
  } catch (error) {
    console.error('Error fetching batteries:', error)
    throw error
  }
}

export const getBatteryActive = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/battery/active`)
    return response.data
  } catch (error) {
    console.error('Error fetching batteries:', error)
    throw error
  }
}
