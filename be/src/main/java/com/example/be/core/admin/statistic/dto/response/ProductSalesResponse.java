package com.example.be.core.admin.statistic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class ProductSalesResponse {
    private Date saleDate; // Ngày bán
    private Integer dailyQuantitySold; // Số lượng bán trong ngày
}