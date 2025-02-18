package com.example.be.dto.response.products;

import lombok.Data;

import java.util.List;

@Data
public class ProductConfigResponse {

    private ProductResponse productResponse;
    private List<ProductDetailResponse> productDetailResponses;

}
