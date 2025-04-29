package com.example.be.core.admin.sale.dto.response;

import lombok.Data;

@Data
public class ProductListResponse {
    private Integer id;
    private String code;
    private String name;
    private String description;
}