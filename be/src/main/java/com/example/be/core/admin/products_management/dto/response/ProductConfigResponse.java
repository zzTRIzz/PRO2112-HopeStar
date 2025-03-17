package com.example.be.core.admin.products_management.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class ProductConfigResponse {

    private ProductResponse productResponse;
    private List<ProductDetailResponse> productDetailRespons1s;

}
