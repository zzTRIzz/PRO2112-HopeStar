import React from "react";
import { QRCodeSVG } from 'qrcode.react';
interface PrintInvoiceProps {
  billData: {
    id: number;
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
    deliveryFee: number;
    customerPayment: number;
    change: number;
  };
}

const InvoiceTemplate: React.FC<PrintInvoiceProps> = ({ billData }) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", width: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "blue", margin: 0 }}>
            HopeStar Shop
          </h1>
          <img
            src="/images/favicon.png"
            alt="logo"
            style={{ width: "40px", height: "40px" }}
          />
        </div>

        <div style={{ fontSize: "14px", textAlign: "left" }}>
          <p><strong>Địa chỉ:</strong> Cao đẳng FPT Polytechnic, Bắc Từ Liêm, Hà Nội</p>
          <p><strong>Điện thoại:</strong> 0705905992</p>
          <p><strong>Email:</strong> hopestarshop2025@gmail.com</p>
        </div>
      </div>

      {/* Tiêu đề */}

      {/* QR Code + Mã hóa đơn và Ngày */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ marginLeft: "30px" }}>
          <QRCodeSVG value={`http://localhost:5173/hoadon/hoadonchitiet?id=${billData?.id}`} size={100} />
        </div>
        <div style={{ textAlign: "center", fontSize: "14px", marginRight: "250px" }}>
          <h2 style={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
            color: "blue",
            margin: "20px 0"
          }}>
            HÓA ĐƠN BÁN HÀNG
          </h2>
          <p><strong>Mã hóa đơn:</strong> {billData?.code}</p>
          <p><strong>Ngày:</strong> {billData?.paymentDate
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
        </div>
      </div>

      {/* <hr style={{ borderTop: "1px dashed #aaa" }} /> */}

      {/* Thông tin bán hàng */}
      <div style={{ fontSize: "14px", marginTop: "10px" }}>
        <p><strong>Nhân viên bán hàng:</strong> {billData?.staff}</p>
        <p><strong>Khách hàng:</strong> {billData?.customer}</p>
        <p><strong>SDT:</strong> {billData?.phone}</p>
      </div>

      {/* Bảng sản phẩm */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px", fontSize: "14px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>STT</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Sản phẩm</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Số imei</th>
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
      <div style={{ textAlign: "right", marginBottom: "20px", fontSize: "18px" }}>
        <p><strong>Tổng số lượng:</strong> {billData?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0)}</p>
        <p><strong>Tổng tiền hàng:</strong> {billData?.totalPrice?.toLocaleString("vi-VN")} đ</p>
        <p><strong>Chiết khấu:</strong> {billData?.discountedTotal?.toLocaleString("vi-VN")} đ</p>
        <p><strong>Phí ship:</strong> {billData?.deliveryFee?.toLocaleString("vi-VN")} đ</p>
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
