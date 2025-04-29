package com.example.be.core.admin.voucher.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VoucherApplyResponse {

    private Integer id;
    private String code;
    private String name;
    private BigDecimal value;
    private Boolean type;
    private String description;
    private BigDecimal minOrderValue;
    private BigDecimal maxOrderValue;
    private BigDecimal maxDiscountAmount;
    private Integer quantity;
    private Boolean isPrivate;


}
