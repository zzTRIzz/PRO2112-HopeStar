package com.example.be.core.admin.products_management.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class ProductRequest {

    private String name;
    private String description;
    private Integer weight;
    private Integer idChip;
    private Integer idBrand;
    private Integer idScreen;
    private Integer idCard;
    private Integer idOs;
    private Integer idWifi;
    private Integer idBluetooth;
    private Boolean nfc;
    private Integer idBattery;
    private String chargerType;
    private String content;
    private List<String> frontCamera;
    private List<String> rearCamera;
    private List<String> category;
    private List<String> sim;
}
