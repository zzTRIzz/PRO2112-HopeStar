package com.example.be.dto.request.products;

import lombok.Data;

@Data
public class SearchProductDetailRequest {

    private String code;
    private Integer idRam;
    private Integer idRom;
    private Integer idColors;

}
