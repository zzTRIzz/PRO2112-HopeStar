import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8080/api/admin/sale';

export const getSales = async () => {
  const jwt = Cookies.get('jwt'); 
  try {
    const response = await axios.get(`${API_BASE_URL}/list`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
};

export const createSale = async (saleData: any) => {
  const jwt = Cookies.get('jwt');
  try {
    const response = await axios.post(`${API_BASE_URL}/add`, saleData, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating sale:', error);
    throw error;
  }
};

export const updateSale = async (id: number, saleData: any) => {
  const jwt = Cookies.get('jwt');
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, saleData, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating sale:', error);
    throw error;
  }
};

export const searchSales = async (params: {
  code?: string;
  dateStart?: string;
  dateEnd?: string;
}) => {
  const jwt = Cookies.get('jwt');
  try {
    const queryParams = new URLSearchParams();
    
    if (params.code?.trim()) {
      queryParams.append('code', params.code.trim());
    }
    
    if (params.dateStart) {
      const startDate = new Date(params.dateStart);
      startDate.setHours(0, 0, 0, 0);
      queryParams.append('dateStart', startDate.toISOString());
    }
    
    if (params.dateEnd) {
      const endDate = new Date(params.dateEnd);
      endDate.setHours(23, 59, 59, 999);
      queryParams.append('dateEnd', endDate.toISOString());
    }

    const response = await axios.get(`${API_BASE_URL}/search?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching sales:', error);
    throw error;
  }
};

export const addProductDetailToSale = async (saleId: number, productDetailId: number) => {
  const jwt = Cookies.get('jwt');
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${saleId}/add-product-detail/${productDetailId}`,
      {},  // empty object as body
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding product detail to sale:', error);
    throw error;
  }
};

export const assignProductsToSale = async (saleId: number, productDetailIds: number[]) => {
  const jwt = Cookies.get('jwt');
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${saleId}/assign-products`,
      productDetailIds,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error assigning products to sale:', error);
    throw error;
  }
};

export const getSaleProducts = async () => {
  const jwt = Cookies.get('jwt');
  try {
    const response = await axios.get('http://localhost:8080/api/admin/products', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sale products:', error);
    throw error;
  }
};

export const getSaleProductDetails = async (saleId: number) => {
  const jwt = Cookies.get('jwt');
  try {
    const response = await axios.get(`${API_BASE_URL}/${saleId}/product-details`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sale product details:', error);
    throw error;
  }
};

export const checkDuplicateCode = async (code: string, id?: number) => {
  const jwt = Cookies.get('jwt');
  try {
    const response = await axios.get(`${API_BASE_URL}/check-code`, {
      params: { 
        code,
        id
      },
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking duplicate code:', error);
    throw error;
  }
};
