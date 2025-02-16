package com.example.be.request.product;

import com.example.be.entity.status.StatusImei;
import lombok.Data;

@Data
public class ProductImeiRequest {

    private String imeiCode;
    private StatusImei statusImei;

}
