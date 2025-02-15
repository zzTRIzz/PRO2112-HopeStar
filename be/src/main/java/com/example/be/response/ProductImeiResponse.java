package com.example.be.response;

import com.example.be.entity.status.StatusImei;
import lombok.Data;

@Data
public class ProductImeiResponse {

    private Integer id;
    private String imeiCod;
    private String barCode;
    private StatusImei statusImei;

}
