package com.example.be.core.client.home.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PhoneFilterRequest {

    private String key;
    private BigDecimal priceStart;
    private BigDecimal priceEnd;
    private Boolean nfc;
    private Integer category;
    private Integer os;
    private Integer brand;
    private Integer chip;
    private Integer ram;
    private Integer rom;
    private String typeScreen;
    private Double sizeScreen;
    private Boolean priceMax;
    private Boolean priceMin;
    private Boolean productSale;

}
