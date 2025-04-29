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
public class BillDetailDto {
    private Integer id;

    private BigDecimal price;

    private Integer quantity;

    private BigDecimal totalPrice;

    private Integer idProductDetail;

    private Integer idBill;

    private String createdBy;

    private String updatedBy;
}
