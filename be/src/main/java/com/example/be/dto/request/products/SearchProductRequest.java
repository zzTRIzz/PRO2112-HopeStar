package com.example.be.dto.request.products;

import lombok.Data;


@Data
public class SearchProductRequest {
    private String code;
    private String name;
    private Integer idChip;
    private Integer idBrand;
    private Integer idScreen;
    private Integer idCard;
    private Integer idOs;
    private Integer idWifi;
    private Integer idBluetooth;
    private Integer idBattery;
    private Integer idCategory;
}
