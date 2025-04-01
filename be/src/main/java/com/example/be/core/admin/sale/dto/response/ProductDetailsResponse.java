package com.example.be.core.admin.sale.dto.response;

import lombok.Data;

import java.math.BigDecimal;
@Data
public class ProductDetailsResponse {
    private Integer id;
    private String code;
    private BigDecimal price;
    private BigDecimal priceSell;
    private Integer inventoryQuantity;
    private String colorName;
    private Integer ramSize;
    private Integer romSize;
    private String productName;
    private Integer discountValue;
    private Boolean discountType;
}
