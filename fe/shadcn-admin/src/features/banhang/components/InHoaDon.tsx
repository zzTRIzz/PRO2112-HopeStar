// import React from "react";

// interface PrintInvoiceProps {
//   billData: {
//     invoiceNumber: string;
//     date: string;
//     staff: string;
//     customer: string;
//     phone: string;
//     items: Array<{
//       product: string;
//       // imei: string[];
//       price: number;
//       quantity: number;
//     }>;
//     total: number;
//     discount: number;
//     payment: number;
//     change: number;
//   };
// }

// const InvoiceTemplate: React.FC<PrintInvoiceProps> = ({ billData }) => {
//       return (
//         <div className="invoice-container p-6 max-w-4xl mx-auto font-sans bg-white">
//           {/* Header */}
//           <div className="text-center mb-4">
//             <h1 className="text-xl font-bold">BPSHOP</h1>
//             <p className="text-xs">
//               Địa chỉ: Cao đẳng FPT Polytechnic, Bắc Tú Liêm, Hà Nội<br />
//               Điện thoại: 0978774487<br />
//               Email: beephoneshop2023@gmail.com
//             </p>
//           </div>

//           {/* Invoice Info */}
//           <div className="text-center mb-4 border-b pb-2">
//             <h2 className="text-lg font-bold uppercase">HÓA ĐƠN BÁN HÀNG</h2>
//             <p className="text-sm">
//               Mã hóa đơn: {billData.invoiceNumber}<br />
//               Ngày {billData.date}
//             </p>
//           </div>

//           {/* Customer & Staff Info */}
//           <div className="flex justify-between mb-4 text-sm">
//             <div>
//               <p><span className="font-semibold">Nhân viên:</span> {billData.staff}</p>
//             </div>
//             <div>
//               <p><span className="font-semibold">Khách hàng:</span> {billData.customer}</p>
//               <p><span className="font-semibold">SĐT:</span> {billData.phone}</p>
//             </div>
//           </div>

//           {/* Products Table */}
//           <table className="w-full mb-4 text-xs border-collapse">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border p-1 w-6">STT</th>
//                 <th className="border p-1 text-left">Sản phẩm</th>
//                 {/* <th className="border p-1 w-32">Số IMEI</th> */}
//                 <th className="border p-1 w-20">Đơn giá</th>
//               </tr>
//             </thead>
//             <tbody>
//               {billData.items.map((item, index) => (
//                 <tr key={index}>
//                   <td className="border p-1 text-center">{index + 1}</td>
//                   <td className="border p-1">{item.product}</td>
//                   {/* <td className="border p-1 font-mono">
//                     {item.imei.join(', ')}
//                   </td> */}
//                   <td className="border p-1 text-right">
//                     {item.price.toLocaleString('vi-VN')} đ
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Summary */}
//           <div className="text-xs">
//             <div className="flex justify-between mb-1">
//               <span>Tổng số lượng:</span>
//               <span>{billData.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
//             </div>
//             <div className="flex justify-between mb-1">
//               <span>Tổng tiền hàng:</span>
//               <span>{billData.total.toLocaleString('vi-VN')} đ</span>
//             </div>
//             <div className="flex justify-between mb-1">
//               <span>Chiết khấu:</span>
//               <span>{billData.discount.toLocaleString('vi-VN')} đ</span>
//             </div>
//             <div className="flex justify-between mb-1 font-bold">
//               <span>Khách phải trả:</span>
//               <span>{(billData.total - billData.discount).toLocaleString('vi-VN')} đ</span>
//             </div>
//             <div className="flex justify-between mb-1">
//               <span>Tiền khách đưa:</span>
//               <span>{billData.payment.toLocaleString('vi-VN')} đ</span>
//             </div>
//             <div className="flex justify-between font-bold text-red-600">
//               <span>Tiền thừa:</span>
//               <span>{billData.change.toLocaleString('vi-VN')} đ</span>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="text-center mt-4 pt-2 border-t text-xs italic">
//             Cám ơn quý khách. Hẹn gặp lại!
//           </div>
//         </div>
//       );
//     };

// export default InvoiceTemplate;

// <div className="invoice-container p-6 max-w-4xl mx-auto font-sans bg-white">
//   {/* Header */}
//   <div className="text-center mb-4 border-b-2 border-black pb-4">
//     <h1 className="text-3xl font-bold text-blue-800 mb-2">BPSHOP</h1>
//     <div className="text-sm">
//       <p className="font-semibold">Địa chỉ: Cao đẳng FPT Polytechnic, Bắc Từ Liêm, Hà Nội</p>
//       <p>Điện thoại: 0978774487 | Email: beephoneshop2023@gmail.com</p>
//     </div>
//   </div>

//   {/* Invoice Info */}
//   <div className="flex justify-between mb-6 px-4">
//     <div className="text-left">
//       <p className="font-bold">Mã hóa đơn: {billData.invoiceNumber}</p>
//       <p>Ngày: {billData.date}</p>
//     </div>
//     <div className="text-center">
//       <h2 className="text-2xl font-bold uppercase text-red-600">HÓA ĐƠN BÁN HÀNG</h2>
//     </div>
//   </div>

//   {/* Customer & Staff Info */}
//   <div className="flex justify-between mb-6 px-4 text-sm bg-gray-50 p-3 rounded">
//     <div>
//       <p className="font-semibold">Nhân viên bán hàng:</p>
//       <p>{billData.staff}</p>
//     </div>
//     <div>
//       <p className="font-semibold">Khách hàng:</p>
//       <p>{billData.customer}</p>
//       <p>SDT: {billData.phone}</p>
//     </div>
//   </div>

//   {/* Products Table */}
//   <table className="w-full mb-4 text-sm border-collapse border-2 border-gray-800">
//     <thead>
//       <tr className="bg-gray-200">
//         <th className="border-2 border-gray-600 p-2 w-12">STT</th>
//         <th className="border-2 border-gray-600 p-2 text-left">Sản phẩm</th>
//         <th className="border-2 border-gray-600 p-2 w-48">Số IMEI</th>
//         <th className="border-2 border-gray-600 p-2 w-32">Đơn giá</th>
//       </tr>
//     </thead>
//     <tbody>
//       {billData.items.map((item, index) => (
//         <tr key={index} className="hover:bg-gray-50">
//           <td className="border-2 border-gray-600 p-2 text-center">{index + 1}</td>
//           <td className="border-2 border-gray-600 p-2">{item.product}</td>
//           <td className="border-2 border-gray-600 p-2 font-mono text-xs">
//             {item.imei.join('\n')}
//           </td>
//           <td className="border-2 border-gray-600 p-2 text-right">
//             {item.price.toLocaleString('vi-VN')} đ
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>

//   {/* Summary */}
//   <div className="text-sm px-4">
//     <div className="grid grid-cols-2 gap-4 mb-2">
//       <div className="border-t-2 border-black pt-2">
//         <p className="font-semibold">Tổng tiền hàng:</p>
//         <p className="font-semibold">Chiết khấu:</p>
//         <p className="font-semibold text-red-600">Khách phải trả:</p>
//         <p className="font-semibold">Tiền khách đưa:</p>
//         <p className="font-semibold text-green-600">Tiền thừa:</p>
//       </div>
//       <div className="border-t-2 border-black pt-2 text-right">
//         <p>{billData.total.toLocaleString('vi-VN')} đ</p>
//         <p>{billData.discount.toLocaleString('vi-VN')} đ</p>
//         <p className="text-red-600">{(billData.total - billData.discount).toLocaleString('vi-VN')} đ</p>
//         <p>{billData.payment.toLocaleString('vi-VN')} đ</p>
//         <p className="text-green-600">{billData.change.toLocaleString('vi-VN')} đ</p>
//       </div>
//     </div>
//   </div>

//   {/* Footer */}
//   <div className="text-center mt-8 pt-4 border-t-2 border-dashed border-gray-400">
//     <p className="text-xs italic text-gray-600">
//       Cảm ơn quý khách đã mua hàng! Hẹn gặp lại!
//     </p>
//     <p className="text-xs mt-2 text-gray-500">
//       * Hóa đơn có giá trị khi có chữ ký và dấu của cửa hàng
//     </p>
//   </div>
// </div>

import React from "react";
interface PrintInvoiceProps {
  billData: {
    code: string;
    paymentDate: string;
    staff: string;
    customer: string;
    phone: string;
    items: Array<{
      product: string;
      imei: string[];
      price: number;
      quantity: number;
    }>;
    totalPrice: number;
    discountedTotal: number;
    customerPayment: number;
    change: number;
  };
}

const InvoiceTemplate: React.FC<PrintInvoiceProps> = ({ billData }) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", width: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>HopeStar Shop</h1>
        <p>Địa chỉ: Cao đẳng FPT Polytechnic, Bắc Từ Liêm, Hà Nội</p>
        <p>Điện thoại: 0976877427 | Email: hopestarshop2025@gmail.com</p>
      </div>

      {/* Title */}
      <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
        HÓA ĐƠN BÁN HÀNG
      </h2>

      {/* Thông tin hóa đơn */}
      <div style={{ marginBottom: "20px" }}>
        <p><strong>Mã hóa đơn:</strong> {billData?.code}</p>
        <p><strong>Ngày:</strong>  {billData?.paymentDate
          ? new Date(billData?.paymentDate).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          })
          : ""}
        </p>
        <p><strong>Nhân viên bán hàng:</strong> {billData?.staff}</p>
        <p><strong>Khách hàng:</strong> {billData?.customer}</p>
        <p><strong>SDT:</strong> {billData?.phone}</p>
      </div>

      {/* Bảng sản phẩm */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>STT</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Sản phẩm</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Số IMEI</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Số lượng</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Đơn giá</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {billData?.items?.map((item: any, index: number) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{index + 1}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.product}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.imei.join(", ")}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{item.quantity}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                {item.price.toLocaleString("vi-VN")} đ
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                {(item.quantity * item.price).toLocaleString("vi-VN")} đ
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tổng kết */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <p><strong>Tổng số lượng:</strong> {billData?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0)}</p>
        <p><strong>Tổng tiền hàng:</strong> {billData?.totalPrice?.toLocaleString("vi-VN")} đ</p>
        <p><strong>Chiết khấu:</strong> {billData?.discountedTotal?.toLocaleString("vi-VN")} đ</p>
        <p><strong>Khách trả:</strong> {billData?.customerPayment?.toLocaleString("vi-VN")} đ</p>
        <p><strong>Tiền thừa:</strong> {billData?.change?.toLocaleString("vi-VN")} đ</p>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>Cảm ơn quý khách. Hẹn gặp lại!</p>
      </div>
    </div>
  );
};

export default InvoiceTemplate;