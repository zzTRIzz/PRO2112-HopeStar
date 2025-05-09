import axios from 'axios';
import Cookies from 'js-cookie';
import type { 
  DayRevenue, 
  MonthRevenue, 
  YearRevenue,
  DayOrderCount,
  MonthOrderCount, 
  YearOrderCount,
  ProductRevenue,
  BestSellingProduct,
  PaidBill,
  TotalOrders,
  LowStockProduct,
  TodayRevenue, 
  MonthlyRevenue, 
  DailyProductSale,
  DateRangeResponse
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api/statistics';

const getAuthConfig = () => {
  const jwt = Cookies.get('jwt');
  return {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  };
};

interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

export const getRevenueByDate = async (params?: DateRangeParams): Promise<DayRevenue[]> => {
  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  
  const response = await axios.get(
    `${API_BASE_URL}/revenue-by-date?${queryParams}`,
    getAuthConfig()
  );
  return response.data;
};

export const getRevenueByDateRange = async (startDate: string, endDate: string): Promise<DayRevenue[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/revenue-by-date-range`,
    {
      ...getAuthConfig(),
      params: { startDate, endDate }
    }
  );
  return response.data;
};

export const getRevenueByMonth = async (): Promise<MonthRevenue[]> => {
  const response = await axios.get(`${API_BASE_URL}/revenue-by-month`, getAuthConfig());
  return response.data;
};

export const getRevenueByYear = async (): Promise<YearRevenue[]> => {
  const response = await axios.get(`${API_BASE_URL}/revenue-by-year`, getAuthConfig());
  return response.data;
};

export const getOrderCountByDate = async (): Promise<DayOrderCount[]> => {
  const response = await axios.get(`${API_BASE_URL}/order-count-by-date`, getAuthConfig());
  return response.data;
};

export const getOrderCountByMonth = async (): Promise<MonthOrderCount[]> => {
  const response = await axios.get(`${API_BASE_URL}/order-count-by-month`, getAuthConfig());
  return response.data;
};

export const getOrderCountByYear = async (): Promise<YearOrderCount[]> => {
  const response = await axios.get(`${API_BASE_URL}/order-count-by-year`, getAuthConfig());
  return response.data;
};

export const getRevenueByProduct = async (): Promise<ProductRevenue[]> => {
  const response = await axios.get(`${API_BASE_URL}/revenue-by-product`, getAuthConfig());
  
  // Tính toán lại phần trăm sau khi nhận data từ API
  const data = response.data;
  const totalRevenue = data.reduce((sum: number, item: ProductRevenue) => sum + item.totalRevenue, 0);
  
  return data.map((item: ProductRevenue) => ({
    ...item,
    percentage: (item.totalRevenue / totalRevenue) * 100
  }));
};

export const getBestSellingProducts = async (): Promise<BestSellingProduct[]> => {
  const response = await axios.get(`${API_BASE_URL}/best-selling-products`, getAuthConfig());
  return response.data;
};

export const getPaidBills = async (): Promise<PaidBill[]> => {
  const response = await axios.get(`${API_BASE_URL}/paid-bills`, getAuthConfig());
  return response.data;
};

export const getTotalPaidOrders = async (): Promise<TotalOrders> => {
  const response = await axios.get(`${API_BASE_URL}/total-paid-orders`, getAuthConfig());
  return response.data;
};

export const getLowStockProducts = async (): Promise<LowStockProduct[]> => {
  const response = await axios.get(`${API_BASE_URL}/low-stock-products`, getAuthConfig());
  return response.data;
};

export const getTodayRevenue = async (): Promise<TodayRevenue> => {
  const response = await axios.get(`${API_BASE_URL}/revenue/today`, getAuthConfig());
  return response.data;
};

export const getMonthlyRevenue = async (): Promise<MonthlyRevenue> => {
  const response = await axios.get(`${API_BASE_URL}/revenue/monthly`, getAuthConfig());
  return response.data;
};

export const getMonthlyProductSales = async (): Promise<DailyProductSale[]> => {
  const response = await axios.get(`${API_BASE_URL}/monthly-product-sales`, getAuthConfig());
  return response.data;
};

export const getLast3DaysRevenue = async (): Promise<DayRevenue[]> => {
  const response = await axios.get(`${API_BASE_URL}/revenue/last-3-days`, getAuthConfig());
  return response.data;
};

export const getLast3DaysOrderCount = async (): Promise<DayOrderCount[]> => {
  const response = await axios.get(`${API_BASE_URL}/order-count/last-3-days`, getAuthConfig());
  return response.data;
};

export const getLast7DaysRevenue = async (): Promise<DayRevenue[]> => {
  const response = await axios.get(`${API_BASE_URL}/revenue/last-7-days`, getAuthConfig());
  return response.data;
};

export const getLast7DaysOrderCount = async (): Promise<DayOrderCount[]> => {
  const response = await axios.get(`${API_BASE_URL}/order-count/last-7-days`, getAuthConfig());
  return response.data;
};

export const getStatisticsByDateRange = async (startDate: string, endDate: string): Promise<DateRangeResponse> => {
  const response = await axios.get(`${API_BASE_URL}/by-date-range`, {
    ...getAuthConfig(),
    params: { startDate, endDate }
  });
  return response.data;
};

export const getCanceledOrders = async () => {
  const response = await axios.get(`${API_BASE_URL}/canceled-orders`, getAuthConfig());
  return response.data;
};

export const getTop10RevenueCustomers = async () => {
  const response = await axios.get(`${API_BASE_URL}/top10-revenue-customers`, getAuthConfig());
  return response.data;
};
