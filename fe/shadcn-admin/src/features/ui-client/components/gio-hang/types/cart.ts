export interface CartItem {
  id: number;
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

export interface Voucher{
  
  id: number
  code: string
  name: string
  value: number
  type: boolean // true là phần trăm, false là giá trị cố định
  description: string
  minOrderValue?: number
  maxOrderValue?: number
  maxDiscountAmount?: number
  
}
