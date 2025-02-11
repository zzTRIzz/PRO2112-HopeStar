package com.example.be.response;

import lombok.Data;

@Data
public class ProductResponse {
    private String id;
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
    private Boolean nfc;
    private String typeBattery;
    private Byte chargerType;
    private Byte status;
    private String content;
}
