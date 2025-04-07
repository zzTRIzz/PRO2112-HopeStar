package com.example.be.core.admin.voucher.dto.model;

import com.example.be.entity.status.StatusVoucher;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VoucherDTO {
    private Integer id;
    private String code;
    private String name;
    private BigDecimal conditionPriceMin;
    private BigDecimal conditionPriceMax;
    private BigDecimal discountValue;
    private BigDecimal maxDiscountAmount;
    private Boolean voucherType;
    private Integer quantity;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private StatusVoucher status;
    private String moTa;
    private Boolean isPrivate = false;  // Added isPrivate with default false
}