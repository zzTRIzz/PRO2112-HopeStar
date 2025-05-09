package com.example.be.core.admin.banhang.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SearchBillDetailDto {
    private Integer id;

    private BigDecimal price;

    private Integer quantity;

    private BigDecimal totalPrice;

    private Integer idProductDetail;

    private String nameProduct;

    private Integer ram;

    private Integer rom;

    private String descriptionRom;

    private String mauSac;

    private String imageUrl;

    private Integer idBill;
}
