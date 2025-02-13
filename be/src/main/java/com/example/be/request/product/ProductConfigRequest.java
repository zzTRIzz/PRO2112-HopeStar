package com.example.be.request.product;

import lombok.Data;

import java.util.List;
@Data
public class ProductConfigRequest {

    private List<ProductDetailRequest> productDetailRequests;
    private ProductRequest productRequest;

}
