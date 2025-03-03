package com.example.be.core.admin.products_management.dto.model;

import com.example.be.entity.status.ProductDetailStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDTO {
    private Integer id;
    private String code;
    private BigDecimal priceSell;
    private Integer inventoryQuantity;
    private ProductDetailStatus status;
    private Integer idColor;
    private Integer idRam;
    private Integer idRom;
    private String imageUrl;
    private List<ProductImeiDTO> productImeiResponses;
}
