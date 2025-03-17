package com.example.be.core.admin.products_management.dto.request;

import com.example.be.entity.status.ProductDetailStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;


@Data
public class ProductDetailRequest {

    private BigDecimal priceSell;
    private Integer inventoryQuantity;
    private Integer idRam;
    private Integer idRom;
    private Integer idColor;
    private List<ProductImeiRequest> productImeiRequests;
    private String imageUrl;
//    private ProductDetailStatus productDetailStatus;

}
