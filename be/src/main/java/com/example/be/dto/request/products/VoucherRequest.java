package com.example.be.dto.request.products;

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
    private Integer discountValue;
    private Boolean voucherType;
    private Integer quantity;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private StatusVoucher status;
}
