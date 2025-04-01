package com.example.be.core.admin.statistic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductRevenueResponse {
    private Integer productId;
    private String code;
    private String name;
    private String description;
    private BigDecimal totalRevenue;
    private BigDecimal percentage;
}