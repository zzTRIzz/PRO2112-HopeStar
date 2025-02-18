package com.example.be.dto.request.products;

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
    private Integer idColors;
    private List<ProductImeiRequest> productImeiRequests;
    private String imageUrl;
    private ProductDetailStatus productDetailStatus;

}
