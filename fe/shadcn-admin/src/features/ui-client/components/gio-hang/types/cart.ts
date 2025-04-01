export interface CartItem {
  id: string;
  productName: string;
  price: number;
  priceSell:number;
  image: string;
  quantity: number;
  ram:string;
  rom:string;
  color:string
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
