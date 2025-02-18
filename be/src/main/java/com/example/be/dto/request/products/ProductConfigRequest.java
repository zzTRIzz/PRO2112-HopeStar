package com.example.be.dto.request.products;

import lombok.Data;

import java.util.List;
@Data
public class ProductConfigRequest {

    private List<ProductDetailRequest> productDetailRequests;
    private ProductRequest productRequest;

}
