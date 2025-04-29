package com.example.be.core.admin.products_management.dto.request;

import lombok.Data;

import java.util.List;
@Data
public class ProductConfigRequest {

    private List<ProductDetailRequest> productDetailRequests;
    private ProductRequest productRequest;

}
