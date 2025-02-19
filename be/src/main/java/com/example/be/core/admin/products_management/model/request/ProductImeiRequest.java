package com.example.be.core.admin.products_management.model.request;

import com.example.be.entity.status.StatusImei;
import lombok.Data;

@Data
public class ProductImeiRequest {

    private String imeiCode;
    private StatusImei statusImei;

}
