package com.example.be.response;

import com.example.be.entity.status.ProductDetailStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDetailResponse {

    private Integer id;
    private String code;
    private BigDecimal priceSell;
    private Integer inventoryQuantity;
    private ProductDetailStatus status;
    private String colorName;
    private Integer ramCapacity;
    private Integer romCapacity;
    private String imageUrl;
    private List<ProductImeiResponse> productImeiResponses;

}
