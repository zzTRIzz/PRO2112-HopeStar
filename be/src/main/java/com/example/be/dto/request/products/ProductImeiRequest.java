package com.example.be.dto.request.products;

import com.example.be.entity.status.StatusImei;
import lombok.Data;

@Data
public class ProductImeiRequest {

    private String imeiCode;
    private StatusImei statusImei;

}
