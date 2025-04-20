package com.example.be.core.admin.products_management.dto.response;

import com.example.be.entity.status.StatusImei;
import lombok.Data;

@Data
public class ProductImeiResponse {

    private Integer id;
    private String code;
    private String barCode;
    private StatusImei statusImei;

}
