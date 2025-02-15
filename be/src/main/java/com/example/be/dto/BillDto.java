package com.example.be.dto;

import com.example.be.entity.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BillDto {
    private Integer id;

    private Integer idCart;

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

    private Instant deliveryDate;

    private Instant customerPreferredDate;

    private Instant customerAppointmentDate;

    private Instant receiptDate;

    private Instant paymentDate;

    private Byte billType;

    private String status;

    private String address;

    private String email;

    private String note;

    private String phone;

    private String name;

    private String createdBy;

    private String updatedBy;

    private Integer idPayment;

    private Integer idDelivery;
}
