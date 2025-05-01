export type ViewMode = 'day' | '3days' | '7days' | 'month' | 'year';

export interface DayRevenue {
  date: string;
  value: number;  // Changed from totalRevenue
}

export interface MonthRevenue {
  year: number;
  month: number;
  value: number;  // Changed from totalRevenue
}

export interface YearRevenue {
  year: number;
  value: number;  // Changed from totalRevenue
}

export interface DayOrderCount {
  orderDate: string;    // Changed from date
  totalOrders: number;  // Changed from count
}

export interface MonthOrderCount {
  orderYear: number;    // Changed from year
  orderMonth: number;   // Changed from month  
  totalOrders: number;  // Changed from count
}

export interface YearOrderCount {
  orderYear: number;    // Changed from year
  totalOrders: number;  // Changed from count
}

export interface ProductRevenue {
  name: string;  // Changed from productName
  totalRevenue: number;  // Changed from revenue
  percentage: number;
}

export interface BestSellingProduct {
  productId: number;
  code: string;
  name: string;
  description: string;
  totalQuantity: number;
}

export interface PaidBill {
  code: string;
  date: string;
  total: number;
}

export interface TotalOrders {
  count: number;
}

export interface PaidBill {
  idBill: string;
  name: string;
  email: string;
  phone: string;
  totalPrice: number; // Added totalPrice property
}

export interface LowStockProduct {
  maSP: string;
  tenSP: string;
  mauSac: string;
  soLuong: number;
  trangThai: string;
  imageUrl: string; // Add imageUrl field
}

export interface TodayRevenue {
  todayRevenue: number;
  numberOfBills: number;
}

export interface MonthlyRevenue {
  monthlyRevenue: number;
  numberOfBills: number;
}

export interface DailyProductSale {
  saleDate: string;
  dailyQuantitySold: number;
}

export interface DateRangeStatistic {
  date: string;
  value: number;  // Changed from revenue to value
  orderCount: number;
}

export interface DateRangeResponse {
  value: number;  // Changed from totalRevenue to value
  totalOrders: number;
  dailyStatistics: DateRangeStatistic[];
}

export interface CanceledOrder {
  customerId: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  billCode: string;
  billStatus: string;
}

export interface TopRevenueCustomer {
  customerId: number;
  customerName: string;
  email: string;
  phone: string;
  totalDueSum: number;
}