import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin/sale';

export const getSales = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/list`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
};

export const createSale = async (saleData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add`, saleData);
    return response.data;
  } catch (error) {
    console.error('Error creating sale:', error);
    throw error;
  }
};

export const updateSale = async (id: number, saleData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, saleData);
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
  try {
    // Format query params
    const queryParams = new URLSearchParams();
    
    // Only add defined params
    if (params.code?.trim()) {
      queryParams.append('code', params.code.trim());
    }
    
    if (params.dateStart) {
      // Convert to ISO string for backend Instant
      const startDate = new Date(params.dateStart);
      startDate.setHours(0, 0, 0, 0);
      queryParams.append('dateStart', startDate.toISOString());
    }
    
    if (params.dateEnd) {
      // Convert to ISO string for backend Instant
      const endDate = new Date(params.dateEnd);
      endDate.setHours(23, 59, 59, 999);
      queryParams.append('dateEnd', endDate.toISOString());
    }

    console.log('Search params:', queryParams.toString()); // For debugging

    const response = await axios.get(`${API_BASE_URL}/search?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error searching sales:', error);
    throw error;
  }
};

export const addProductDetailToSale = async (saleId: number, productDetailId: number) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${saleId}/add-product-detail/${productDetailId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error adding product detail to sale:', error);
    throw error;
  }
};

export const assignProductsToSale = async (saleId: number, productDetailIds: number[]) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${saleId}/assign-products`,
      {
        productDetailIds
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error assigning products to sale:', error);
    throw error;
  }
};

export const getSaleProducts = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/admin/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching sale products:', error);
    throw error;
  }
};

export const getSaleProductDetails = async (saleId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${saleId}/product-details`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sale product details:', error);
    throw error;
  }
};
