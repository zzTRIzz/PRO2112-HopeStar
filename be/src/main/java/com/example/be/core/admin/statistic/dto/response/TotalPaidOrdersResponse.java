package com.example.be.core.admin.statistic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TotalPaidOrdersResponse {
    private Long totalPaidOrders; // Tổng số lượng hóa đơn đã thanh toán
}