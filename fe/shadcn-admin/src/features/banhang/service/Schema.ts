import { z } from 'zod';

export const billSchema = z.object({
  id: z.number().int().positive(),
  nameBill: z.string().max(255),
  idAccount: z.number().int().positive().nullable(),
  idNhanVien: z.number().int().positive().nullable(),
  idVoucher: z.number().int().positive().nullable(),
  totalPrice: z.number().nonnegative().default(0),
  customerPayment: z.number().nonnegative().default(0),
  amountChange: z.number().nonnegative().default(0),
  deliveryFee: z.number().nonnegative().default(0),
  totalDue: z.number(),
  customerRefund: z.number().nonnegative().default(0),
  discountedTotal: z.number().nonnegative().default(0),
  deliveryDate: z.string().datetime().nullable(),
  customerPreferred_date: z.string().datetime().nullable(),
  customerAppointment_date: z.string().datetime().nullable(),
  receiptDate: z.string().datetime().nullable(),
  paymentDate: z.string().datetime().nullable(),
  billType: z.number().int().default(0),
  status: z.string().max(255),
  address: z.string().max(255).nullable(),
  email: z.string().email().max(255).nullable(),
  note: z.string().max(1000).nullable(),
  phone: z.string().max(255).nullable(),
  name: z.string().max(255).nullable(),
  idPayment: z.number().int().positive().nullable(),
  idDelivery: z.number().int().positive().nullable(),
  itemCount: z.number().int().positive(),
});
export type BillSchema = z.infer<typeof billSchema>;

export const Voucher = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  conditionPriceMin: z.number(),
  conditionPriceMax: z.number(),
  discountValue: z.number(),
  voucherType: z.boolean(),
  quantity: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.string(),
});

export type Voucher = z.infer<typeof Voucher>;



export interface SearchBillDetail {
  id: number
  price: number,
  quantity: number,
  totalPrice: number,
  idProductDetail: number,
  nameProduct: string,
  ram: number,
  rom: number,
  mauSac: string,
  imageUrl: string,
  idBill: number
}

export interface ProductDetail {
  id: number,
  code: string,
  priceSell: number,
  inventoryQuantity: number,
  idProduct: number,
  name: string,
  ram: number,
  rom: number,
  color: string,
  imageUrl: string,
}

export interface AccountKhachHang {
  id: number,
  code: string,
  fullName: string,
  email: string,
  phone: string,
  address: string,
  googleId: string
}
export interface Imei {
  id: number,
  imeiCode: string,
  barCode: string,
  status: string
}


export const ImeiSold = z.object({
  id_Imei: z.array(z.number()), // Danh sách số nguyên
  idBillDetail: z.number(),
});

export type ImeiSoldSchema = z.infer<typeof ImeiSold>;





export const billDetailSchema = z.object({
  idBill: z.number().int().positive(),
  idProductDetail: z.number().int().positive()
});

export type BillDetailSchema = z.infer<typeof billDetailSchema>;



export interface HoaDon {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerPhone: string;
  products: SearchBillDetail[];
  khachHang: AccountKhachHang
  totalAmount: number;
  paymentMethod: string;
}


export interface TaiKhoan {
  id: number
  code: string
  fullName: string
  email: string
  phone: string
  address: string
  imageAvatar: string
  idRole: {
    id: number
    code: string
    name: string
  }
  status: "ACTIVE" | "IN_ACTIVE"
  gender: boolean
  birthDate: string | null
}





export interface BillRespones {
  id: number;
  code: string;
  idAccount: number;
  idNhanVien: number;
  fullNameNV: string;
  idVoucher: number;
  codeVoucher: string | null;
  totalPrice: number;
  customerPayment: number | null;
  amountChange: number | null;
  deliveryFee: number | null;
  totalDue: number;
  customerRefund: number | null;
  discountedTotal: number;
  deliveryDate: string | null;
  customerPreferredDate: string | null;
  customerAppointmentDate: string | null;
  receiptDate: string | null;
  paymentDate: string | null;
  billType: number;
  status: string;
  address: string | null;
  email: string | null;
  note: string | null;
  phone: string | null;
  name: string | null;
  payment: number | null;
  delivery: number | null;
  detailCount: number;
  billDetailResponesList: BillDetailRespones[];
}

export interface BillDetailRespones {
  id: number;
  price: number;
  quantity: number;
  totalPrice: number;
  productDetail: ProductDetailRespones;
  createdBy: string | null;
  updatedBy: string | null;
  imeiSoldRespones: ImeiSoldRespone[];
}

export interface ProductDetailRespones {
  id: number;
  productName: string;
  ram: number;
  rom: number;
  color: string;
  image: string;
  price: number;
  priceSell: number;
}

export interface ImeiSoldRespone {
  id: number;
  id_Imei: ImeiRespones;
}

export interface ImeiRespones {
  id: number;
  imeiCode: string;
  barCode: string;
  status: string;
}

