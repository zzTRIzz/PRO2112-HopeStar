package com.example.be.core.admin.statistic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueByMonthResponse {
    private Integer year;
    private Integer month;
    private BigDecimal value;
}