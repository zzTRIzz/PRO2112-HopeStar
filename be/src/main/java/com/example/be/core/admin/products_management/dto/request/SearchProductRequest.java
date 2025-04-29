package com.example.be.core.admin.products_management.dto.request;

import com.example.be.entity.status.StatusCommon;
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
    private String status;

    public StatusCommon getStatusCommon() {
        if (this.status == null) {
            return null;
        }
        try {
            return StatusCommon.valueOf(this.status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
