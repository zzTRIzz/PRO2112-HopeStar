export interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  image: string;
  quantity: number;
}

export interface OrderSummary {
  totalAmount: number;
  discount: number;
  productDiscount: number;
  voucher: number;
  finalAmount: number;
}

export interface Voucher {
  id: string;
  code: string;
  value: number;
  type: 'fixed' | 'percentage';
  minOrderValue?: number;
  description: string;
}
