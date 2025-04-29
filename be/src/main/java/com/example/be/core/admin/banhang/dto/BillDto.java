package com.example.be.core.admin.banhang.dto;

import com.example.be.entity.status.StatusBill;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BillDto {
    private Integer id;

    private String nameBill;

    private String maBill;

    private Integer idAccount;

    private Integer idNhanVien;

    private Integer idVoucher;

    private BigDecimal totalPrice;

    private BigDecimal customerPayment;

    private BigDecimal amountChange;

    private BigDecimal deliveryFee;

    private BigDecimal totalDue;

    private BigDecimal customerRefund;

    private BigDecimal discountedTotal;

    private BigDecimal payInsurance;

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

    private Integer idDelivery;

    private Integer itemCount;
}
