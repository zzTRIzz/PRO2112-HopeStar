package com.example.be.core.client.cart.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CheckCartRequest {

    private List<Integer> idCartDetailList;
    private BigDecimal price;
    private Integer idVoucher;

}
