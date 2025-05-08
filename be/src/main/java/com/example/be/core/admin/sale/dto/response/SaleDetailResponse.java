package com.example.be.core.admin.sale.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SaleDetailResponse {
    private Integer productId;
    private Integer id;
    private Integer productDetailId;
    private String productName;
    private String productCode;
    private BigDecimal price;
}