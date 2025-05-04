
export interface Bill {
  id: number;
  nameBill: string;
  maBill: string;
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
  receiptDate?: string | null;
  paymentDate?: Date | null;
  address?: string | null;
  email?: string | null;
  note?: string | null;
  phone?: string | null;
  name: string;
  paymentId?: number | null;
  namePayment?: number | null;
  idDelivery?: number | null;
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

export interface BillHistory {
  id: number;
  actionType: StatusBillHistory;
  note: string;
  actionTime: Date;
  idNhanVien: number | null;
  fullName: string | null;
}


export enum StatusBillHistory {
  CHO_THANH_TOAN = 'Chờ thanh toán',
  CHO_XAC_NHAN = 'Chờ xác nhận',
  DA_XAC_NHAN = 'Đã xác nhận ',
  DANG_CHUAN_BI_HANG = 'Đang chuẩn bị hàng ',
  DANG_GIAO_HANG = 'Đang giao hàng ',
  HOAN_THANH = 'Hoàn thành ',
  DA_HUY = 'Đã hủy',
  CAP_NHAT_DON_HANG = 'Cập nhật đơn hàng ',
}

export interface BillHistoryRequest {
  actionType: string;
  note: string;
  idBill: number;
}