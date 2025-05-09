package com.example.be.core.admin.banhang.dto;

import com.example.be.entity.status.ProductDetailStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDto {
    private Integer id;
    private String code;
    private String name;
    private BigDecimal priceSell;
    private Integer inventoryQuantity;
    private ProductDetailStatus status;
    private String Color;
    private Integer Ram;
    private Integer Rom;
    private String descriptionRom;
    private String imageUrl;
    private Integer idImei;
}
