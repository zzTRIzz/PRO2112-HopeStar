package com.example.be.request;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDetailRequest {
    private BigDecimal priceSell;
    private Integer idRam;
    private Integer idRom;
    private Integer idColors;


}
