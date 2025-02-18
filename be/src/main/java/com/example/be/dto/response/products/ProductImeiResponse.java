package com.example.be.dto.response.products;

import com.example.be.entity.status.StatusImei;
import lombok.Data;

@Data
public class ProductImeiResponse {

    private Integer id;
    private String imeiCode;
    private String barCode;
    private StatusImei statusImei;

}
