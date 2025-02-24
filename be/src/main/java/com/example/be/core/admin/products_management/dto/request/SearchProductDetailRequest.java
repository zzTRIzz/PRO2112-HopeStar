package com.example.be.core.admin.products_management.dto.request;

import lombok.Data;

@Data
public class SearchProductDetailRequest {

    private String code;
    private Integer idRam;
    private Integer idRom;
    private Integer idColors;

}
