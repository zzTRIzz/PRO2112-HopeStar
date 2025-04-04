export type ViewMode = 'day' | 'month' | 'year';

export interface DayRevenue {
  date: string;
  totalRevenue: number;
}

export interface MonthRevenue {
  year: number;
  month: number;
  totalRevenue: number;
}

export interface YearRevenue {
  year: number;
  totalRevenue: number;
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