# Về dự án

Dự án là website bán điện thoại di động **HopeStar**, thiết kế và xây dựng với mục tiêu mang đến cho người dùng có một trải nghiệm mua sắm trực tuyến đơn giản, mượt mà.

## Tính Năng

- **Các chức năng**: Đang trong quá trình phát triển.

## Công Nghệ Sử Dụng

Website được xây dựng với các công nghệ sau:

- **Frontend**:
  - ReactJS (cho xây dựng các thành phần UI tương tác)

- **Backend**:
  - **Java Spring Boot** (cho logic phía server)
  - MySQL (cho việc lưu trữ dữ liệu người dùng, thông tin sản phẩm và đơn hàng,v.v...)

- **Xác Thực**:
  - JWT (JSON Web Tokens) cho xác thực người dùng bảo mật

- **Cổng Thanh Toán**:
  - Tích hợp với dịch vụ thanh toán (VNPAY) để xử lý giao dịch.

## Cấu trúc thư mục

```bash
PRO2112-HopeStar/
├───be/  # Mã nguồn backend (Spring Boot, API, Logic)
├───db/  # Cấu trúc và dữ liệu mẫu trong cơ sở dữ liệu (SQL schema)
└───fe/  # Mã nguồn frontend (React, UI components)
```

## Cài Đặt

Để bắt đầu với chạy dự án, làm theo các bước sau:

1. **Clone kho lưu trữ**:

   ```bash
   git clone https://github.com/zzTRIzz/PRO2112-HopeStar
   ```