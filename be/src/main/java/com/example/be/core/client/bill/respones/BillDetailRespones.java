package com.example.be.core.client.bill.respones;


import com.example.be.entity.Bill;
import com.example.be.entity.ProductDetail;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BillDetailRespones {
    private Integer id;

    private BigDecimal price;

    private Integer quantity;

    private BigDecimal totalPrice;

    private ProductDetailRespones productDetail ;

    private String createdBy;

    private String updatedBy;
}
