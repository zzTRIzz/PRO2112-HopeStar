package com.example.be.core.admin.statistic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderCountByYearResponse {
    private Integer orderYear;  // Năm
    private Long totalOrders;    // Số lượng hóa đơn

}