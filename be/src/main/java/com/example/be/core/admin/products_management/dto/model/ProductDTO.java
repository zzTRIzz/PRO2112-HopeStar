package com.example.be.core.admin.products_management.dto.model;

import com.example.be.entity.status.StatusCommon;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Integer id;
    private String code;
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
    private StatusCommon status;
    private String content;
    private List<String> frontCamera;
    private List<String> rearCamera;
    private List<String> category;
    private List<String> sim;
    private Integer totalNumber;
    private Integer totalVersion;
}

