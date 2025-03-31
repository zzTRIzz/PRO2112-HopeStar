import React from "react";
import "../css/print_hoaDon.css"

interface PrintInvoiceProps {
  billData: {
    orderId: string;
    orderDate: string;
    customerName: string;
    customerPhone: string;
    products: Array<{
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>;
    totalAmount: number;
    paymentMethod: string;
  };
}

// const InHoaDon: React.FC<PrintInvoiceProps> = ({ billData }) => {
//   return (
//     <div className="invoice-container">
//       <h1>HÓA ĐƠN BÁN HÀNG</h1>
//       <div className="invoice-info">
//         <p>Mã đơn: {billData.orderId}</p>
//         <p>Ngày: {billData.orderDate}</p>
//         <p>Khách hàng: {billData.customerName}</p>
//         <p>SĐT: {billData.customerPhone}</p>
//       </div>

//       <table className="invoice-table" border={1}>
//         <thead>
//           <tr>
//             <th>STT</th>
//             <th>Tên sản phẩm</th>
//             <th>Số lượng</th>
//             <th>Đơn giá</th>
//             <th>Thành tiền</th>
//           </tr>
//         </thead>
//         <tbody>
//           {billData.products.map((product, index) => (
//             <tr key={index}>
//               <td>{index + 1}</td>
//               <td>{product.name}</td>
//               <td>{product.quantity}</td>
//               <td>{product.price.toLocaleString()}đ</td>
//               <td>{product.total.toLocaleString()}đ</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="total-section">
//         <p>Tổng cộng: {billData.totalAmount.toLocaleString()}đ</p>
//         <p>Phương thức thanh toán: {billData.paymentMethod}</p>
//       </div>
//     </div>
//   );
// };

const InHoaDon: React.FC<PrintInvoiceProps> = ({ billData }) => {
  return (
    <div className="print-container">
      <h1>HÓA ĐƠN BÁN HÀNG</h1>
      <p>Mã đơn: {billData?.orderId}</p>
      <p>Ngày: {billData?.orderDate}</p>
      <p>Khách hàng: {billData?.customerName}</p>
      <p>SDT: {billData?.customerPhone}</p>
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {billData?.products?.map((product: any, index: number) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{product.price.toLocaleString("vi-VN")} đ</td>
              <td>{product.total.toLocaleString("vi-VN")} đ</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Tổng cộng: {billData?.totalAmount.toLocaleString("vi-VN")} đ</p>
      <p>Phương thức thanh toán: {billData?.paymentMethod}</p>
    </div>
  );
};

export default InHoaDon;