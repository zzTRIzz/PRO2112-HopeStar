package com.example.be.core.admin.products_management.dto.request;

import lombok.Data;


@Data
public class SearchProductRequest {
    private String key;
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
