package com.example.be.core.admin.banhang.request;

import com.example.be.entity.status.StatusBill;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class SearchBillRequest {
    private String key;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Byte loaiHoaDon;
    private StatusBill trangThai;
//    private Integer idTaiKhoan; // ID tài khoản khách hàng
//    private Integer idNhanVien; // ID nhân viên xử lý
//    private Integer idVoucher; // ID voucher
//
//    private Integer idPhuongThucThanhToan; // ID phương thức thanh toán
//    private Integer idPhuongThucGiaoHang; // ID phương thức giao hàng
}
