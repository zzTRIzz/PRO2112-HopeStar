package com.example.be.core.admin.products_management.dto.response;

import com.example.be.entity.status.StatusCommon;
import lombok.Data;

import java.util.List;

@Data
public class ProductResponse {
    private Integer id;
    private String code;
    private String name;
    private String description;
    private Integer weight;
    private String nameChip;
    private String nameBrand;
    private String typeScreen;
    private String typeCard;
    private String nameOs;
    private String nameWifi;
    private String nameBluetooth;
    private List<String> frontCamera;
    private List<String> rearCamera;
    private List<String> category;
    private List<String> sim;
    private Boolean nfc;
    private String typeBattery;
    private String chargerType;
    private StatusCommon status;
    private String content;
    private Integer totalNumber;
    private Integer totalVersion;
}
