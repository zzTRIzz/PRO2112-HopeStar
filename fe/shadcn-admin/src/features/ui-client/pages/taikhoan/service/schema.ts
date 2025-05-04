
interface ProductDetail {
    id: number;
    productName: string;
    ram: string;
    rom: string;
    descriptionRom: string;
    color: string;
    image: string;
    price: number;
    priceSell: number;
  }
  
  interface BillDetail {
    id: number;
    price: number;
    quantity: number;
    totalPrice: number;
    createdBy: string;
    updatedBy: string;
    productDetail: ProductDetail;
  }
  
 export interface Bill {
    id: number;
    code: string;
    maBill: string;
    fullNameKh: string;
    fullNameNV: string;
    codeVoucher: string;
    totalPrice: number;
    customerPayment: number;
    amountChange: number;
    deliveryFee: number;
    totalDue: number;
    customerRefund: number;
    discountedTotal: number;
    payInsurance: number;
    deliveryDate: string;
    paymentDate: string;
    billType: number;
    status:  'CHO_XAC_NHAN'  | 'DANG_CHUAN_BI_HANG' | 'DANG_GIAO_HANG' | 'HOAN_THANH' | 'DA_HUY' ;
    address: string;
    email: string;
    phone: string;
    note: string;
    name: string;
    payment: number;
    delivery: number;
    detailCount: number;
    billDetailResponesList: BillDetail[];
  }
  