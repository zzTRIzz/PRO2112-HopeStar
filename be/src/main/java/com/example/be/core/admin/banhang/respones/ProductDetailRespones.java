package com.example.be.core.admin.banhang.respones;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDetailRespones {
    private Integer id;

    private String productName;

    private Integer ram;

    private Integer rom;

    private String descriptionRom;

    private String color;

    private String image;

    private BigDecimal price;

    private BigDecimal priceSell;
}
