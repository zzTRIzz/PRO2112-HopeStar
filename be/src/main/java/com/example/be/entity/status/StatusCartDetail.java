package com.example.be.entity.status;

public enum StatusCartDetail {
    pending,    // Mặc định khi thêm vào giỏ hàng
    selected,   // Khi tick checkbox chọn thanh toán
    purchased;  // Khi thanh toán thành công - da dat hang
}
