package com.example.be.core.admin.statistic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BestSellingProductResponse {
    private Long productId;      // ID sản phẩm
    private String code;         // Mã sản phẩm
    private String name;         // Tên sản phẩm
    private String description;  // Mô tả sản phẩm
    private Long totalQuantity;   // Tổng số lượng đã bán

}