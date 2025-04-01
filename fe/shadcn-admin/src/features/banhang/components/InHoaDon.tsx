import React from "react";

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
    <div>
      <h1 style={{ textAlign: "center" }}>HÓA ĐƠN BÁN HÀNG</h1>
      <p>Mã đơn: {billData?.orderId}</p>
      <p>Ngày: {billData?.orderDate}</p>
      <p>Khách hàng: {billData?.customerName}</p>
      <p>SDT: {billData?.customerPhone}</p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
      <p style={{ textAlign: "right" }}>Tổng cộng: {billData?.totalAmount.toLocaleString("vi-VN")} đ</p>
      <p>Phương thức thanh toán: {billData?.paymentMethod}</p>
    </div>
  );
};

export default InHoaDon;












// import React, { forwardRef } from "react";
// import { AccountKhachHang, BillSchema, SearchBillDetail } from "../service/Schema";

// interface PrintInvoiceProps {
//   billData: BillSchema;
//   product: SearchBillDetail[];
//   khachHang: AccountKhachHang | undefined;
// }

// const InHoaDon: React.FC<PrintInvoiceProps> = ({ billData, product, khachHang }) => {
//   if (!billData) {
//     return <div>Không có dữ liệu hóa đơn</div>;
//   }

//   // Format ngày tháng
//   const formatDate = (dateString: string | null | undefined) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("vi-VN");
//   };

//   return (
//     <div style={{ 
//       width: "100%", 
//       maxWidth: "800px", 
//       margin: "0 auto", 
//       padding: "20px",
//       fontFamily: "Arial, sans-serif",
//       fontSize: "14px"
//     }}>
//       <h1 style={{ 
//         textAlign: "center", 
//         fontSize: "20px", 
//         marginBottom: "20px",
//         textTransform: "uppercase",
//         fontWeight: "bold"
//       }}>
//         HÓA ĐƠN BÁN HÀNG
//       </h1>
      
//       <div style={{ 
//         display: "flex",
//         justifyContent: "space-between",
//         marginBottom: "15px"
//       }}>
//         <div>
//           <p><strong>Mã đơn:</strong> {billData.nameBill}</p>
//           <p><strong>Ngày:</strong> {formatDate(billData.paymentDate)}</p>
//         </div>
//         <div>
//           <p><strong>Nhân viên:</strong> NV{billData.idNhanVien}</p>
//           <p><strong>Trạng thái:</strong> {billData.status}</p>
//         </div>
//       </div>

//       <div style={{ marginBottom: "15px" }}>
//         <p><strong>Khách hàng:</strong> {khachHang?.fullName || "Khách lẻ"}</p>
//         <p><strong>SĐT:</strong> {khachHang?.phone || "N/A"}</p>
//         <p><strong>Địa chỉ:</strong> {khachHang?.address || "N/A"}</p>
//       </div>

//       <table style={{ 
//         width: "100%", 
//         borderCollapse: "collapse",
//         margin: "20px 0",
//         border: "1px solid #000"
//       }}>
//         <thead>
//           <tr style={{ backgroundColor: "#f2f2f2" }}>
//             <th style={{ padding: "8px", border: "1px solid #000", textAlign: "center" }}>STT</th>
//             <th style={{ padding: "8px", border: "1px solid #000", textAlign: "left" }}>Tên sản phẩm</th>
//             <th style={{ padding: "8px", border: "1px solid #000", textAlign: "center" }}>Số lượng</th>
//             <th style={{ padding: "8px", border: "1px solid #000", textAlign: "right" }}>Đơn giá</th>
//             <th style={{ padding: "8px", border: "1px solid #000", textAlign: "right" }}>Thành tiền</th>
//           </tr>
//         </thead>
//         <tbody>
//           {product.map((product, index) => (
//             <tr key={index}>
//               <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</td>
//               <td style={{ padding: "8px", border: "1px solid #ddd" }}>
//                 {product.nameProduct}
//                 <br />
//                 <small>RAM: {product.ram}GB | ROM: {product.rom}GB | Màu: {product.mauSac}</small>
//               </td>
//               <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>{product.quantity}</td>
//               <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
//                 {product.price.toLocaleString("vi-VN")} đ
//               </td>
//               <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
//                 {product.totalPrice.toLocaleString("vi-VN")} đ
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div style={{ 
//         marginTop: "20px",
//         textAlign: "right",
//         borderTop: "1px solid #000",
//         paddingTop: "10px"
//       }}>
//         <p><strong>Tổng tiền hàng:</strong> {billData.totalPrice?.toLocaleString("vi-VN") || "0"} đ</p>
//         {billData.discountedTotal && billData.discountedTotal > 0 && (
//           <p><strong>Giảm giá:</strong> -{(billData.totalPrice - billData.discountedTotal).toLocaleString("vi-VN")} đ</p>
//         )}
//         {billData.deliveryFee && billData.deliveryFee > 0 && (
//           <p><strong>Phí giao hàng:</strong> +{billData.deliveryFee.toLocaleString("vi-VN")} đ</p>
//         )}
//         <p style={{ fontSize: "16px", fontWeight: "bold" }}>
//           <strong>Tổng thanh toán:</strong> {billData.totalDue?.toLocaleString("vi-VN") || "0"} đ
//         </p>
//         <p><strong>Khách thanh toán:</strong> {billData.customerPayment?.toLocaleString("vi-VN") || "0"} đ</p>
//         {billData.amountChange && billData.amountChange > 0 && (
//           <p><strong>Tiền thừa trả khách:</strong> {billData.amountChange.toLocaleString("vi-VN")} đ</p>
//         )}
//         <p>
//           <strong>Phương thức thanh toán:</strong>{" "}
//           {billData.idPayment === 1 ? "Tiền mặt" : billData.idPayment === 2 ? "Chuyển khoản" : "Khác"}
//         </p>
//       </div>

//       <div style={{ 
//         marginTop: "30px",
//         textAlign: "center",
//         fontStyle: "italic"
//       }}>
//         <p>Cảm ơn quý khách đã mua hàng!</p>
//         <p>Hẹn gặp lại quý khách trong các lần mua hàng tiếp theo</p>
//       </div>
//     </div>
//   );
// };

// export default InHoaDon;