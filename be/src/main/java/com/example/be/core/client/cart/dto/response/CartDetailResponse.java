package com.example.be.core.client.cart.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartDetailResponse {

    private Integer id;
    private Integer idProduct;
    private String productName;
    private Integer quantity;
    private String ram;
    private String rom;
    private String color;
    private String image;
    private BigDecimal price;
    private BigDecimal priceSell;

}
