import axios from 'axios';
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
  DailyProductSale
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api/statistics';

export const getRevenueByDate = async (): Promise<DayRevenue[]> => {
  const response = await axios.get(`${API_BASE_URL}/revenue-by-date`);
  return response.data;
};

export const getRevenueByMonth = async (): Promise<MonthRevenue[]> => {
  const response = await axios.get(`${API_BASE_URL}/revenue-by-month`);
  return response.data;
};

export const getRevenueByYear = async (): Promise<YearRevenue[]> => {
  const response = await axios.get(`${API_BASE_URL}/revenue-by-year`);
  return response.data;
};

export const getOrderCountByDate = async (): Promise<DayOrderCount[]> => {
  const response = await axios.get(`${API_BASE_URL}/order-count-by-date`);
  return response.data;
};

export const getOrderCountByMonth = async (): Promise<MonthOrderCount[]> => {
  const response = await axios.get(`${API_BASE_URL}/order-count-by-month`);
  return response.data;
};

export const getOrderCountByYear = async (): Promise<YearOrderCount[]> => {
  const response = await axios.get(`${API_BASE_URL}/order-count-by-year`);
  return response.data;
};

export const getRevenueByProduct = async (): Promise<ProductRevenue[]> => {
  const response = await axios.get(`${API_BASE_URL}/revenue-by-product`);
  
  // Tính toán lại phần trăm sau khi nhận data từ API
  const data = response.data;
  const totalRevenue = data.reduce((sum: number, item: ProductRevenue) => sum + item.totalRevenue, 0);
  
  return data.map((item: ProductRevenue) => ({
    ...item,
    percentage: (item.totalRevenue / totalRevenue) * 100
  }));
};

export const getBestSellingProducts = async (): Promise<BestSellingProduct[]> => {
  const response = await axios.get(`${API_BASE_URL}/best-selling-products`);
  return response.data;
};

export const getPaidBills = async (): Promise<PaidBill[]> => {
  const response = await axios.get('http://localhost:8080/api/statistics/paid-bills');
  return response.data;
};

export const getTotalPaidOrders = async (): Promise<TotalOrders> => {
  const response = await axios.get(`${API_BASE_URL}/total-paid-orders`);
  return response.data;
};

export const getLowStockProducts = async (): Promise<LowStockProduct[]> => {
  const response = await axios.get(`${API_BASE_URL}/low-stock-products`);
  return response.data;
};

export const getTodayRevenue = async (): Promise<TodayRevenue> => {
  const response = await axios.get(`${API_BASE_URL}/revenue/today`);
  return response.data;
};

export const getMonthlyRevenue = async (): Promise<MonthlyRevenue> => {
  const response = await axios.get(`${API_BASE_URL}/revenue/monthly`);
  return response.data;
};

export const getMonthlyProductSales = async (): Promise<DailyProductSale[]> => {
  const response = await axios.get(`${API_BASE_URL}/monthly-product-sales`);
  return response.data;
};
