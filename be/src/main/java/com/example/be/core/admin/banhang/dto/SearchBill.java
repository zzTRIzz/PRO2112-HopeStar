package com.example.be.core.admin.banhang.dto;

import com.example.be.entity.status.StatusBill;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SearchBill {
    private Integer id;

    private String nameBill;

    private String maBill;

    private Integer idAccount;

    private String tenKhachHang;

    private String soDienThoai;

    private Integer idNhanVien;

    private String tenNhanVien;

    private Integer idVoucher;

    private String tenVoucher;

    private BigDecimal totalPrice;

    private BigDecimal customerPayment;

    private BigDecimal amountChange;

    private BigDecimal deliveryFee;

    private BigDecimal totalDue;

    private BigDecimal customerRefund;

    private BigDecimal discountedTotal;

    private LocalDateTime receiptDate;

    private LocalDateTime paymentDate;

    private Byte billType;

    private StatusBill status;

    private String address;

    private String email;

    private String note;

    private String phone;

    private String name;

    private String createdBy;

    private String updatedBy;

    private Integer idPayment;

    private Byte namePayment;

    private Integer idDelivery;

}
