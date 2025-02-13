package com.example.be.request.product;

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

}
