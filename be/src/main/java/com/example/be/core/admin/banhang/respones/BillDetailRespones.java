package com.example.be.core.admin.banhang.respones;


import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BillDetailRespones {
    private Integer id;

    private BigDecimal price;

    private Integer quantity;

    private BigDecimal totalPrice;

    private ProductDetailRespones productDetail ;

    private String createdBy;

    private String updatedBy;

    private List<ImeiSoldRespone> imeiSoldRespones;
}
