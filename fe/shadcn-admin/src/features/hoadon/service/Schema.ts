

export interface Bill {
  id: number;
  nameBill: string;
  idAccount?: number | null;
  tenKhachHang?: string | null;
  soDienThoai?: string | null;
  idNhanVien?: number | null;
  idVoucher?: number | null;
  totalPrice: number | null;
  customerPayment: number | null;
  amountChange: number | null;
  deliveryFee: number | null;
  totalDue: number;
  customerRefund: number | null;
  discountedTotal: number | null;
  deliveryDate?: string | null;
  customerPreferred_date?: string | null;
  customerAppointment_date?: string | null;
  receiptDate?: string | null;
  paymentDate?: Date | null;
  address?: string | null;
  email?: string | null;
  note?: string | null;
  phone?: string | null;
  name: string;
  paymentId?: number | null;
  namePayment?: number | null;
  deliveryId?: number | null;
  itemCount: number;
  billType: number;
  status: string;
}

export interface UpdateCustomerRequest {
  id?: number;
  name: string;
  phone: string;
  address: string;
  note?: string;
  deliveryFee: number;
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
