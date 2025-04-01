package com.example.be.core.admin.statistic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderCountByDateResponse {
    private String orderDate; // Ngày
    private Long totalOrders;  // Số lượng hóa đơn
}