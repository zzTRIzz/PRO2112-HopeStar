package com.example.be.core.admin.statistic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class RevenueTop10CustomerResponse {
    private Long customerId;
    private String customerName;
    private String email;
    private String phone;
    private BigDecimal totalDueSum;
}