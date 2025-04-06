package com.example.be.core.admin.voucher.dto.request;

import com.example.be.entity.status.StatusVoucher;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class VoucherRequest {
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
