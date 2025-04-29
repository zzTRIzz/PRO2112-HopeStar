package com.example.be.entity.status;

public enum StatusBill {
    CHO_THANH_TOAN,         // 0 - Chờ thanh toán
    CHO_XAC_NHAN,           // 1 - Chờ xác nhận (dành cho đơn online)
    DA_XAC_NHAN,           // 1 - DA xác nhận (dành cho đơn online)
    DANG_CHUAN_BI_HANG,     // 2 - Đang chuẩn bị hàng
    DANG_GIAO_HANG,         // 4 - Đang giao hàng
    DA_GIAO_HANG,           // 5 - Đã giao hàng thành công
    DA_THANH_TOAN,          // 6 - Đã thanh toán (cả online và tại quầy)
    HOAN_THANH,             // 7 - Hoàn thành đơn hàng
    DA_HUY,                 // 8 - Đã hủy
//    BI_HOAN_TRA,            // 9 - Đơn hàng bị hoàn trả
//    CHO_HOAN_TIEN,          // 10 - Đang xử lý hoàn tiền
//    DA_HOAN_TIEN            // 11 - Đã hoàn tiền
}
