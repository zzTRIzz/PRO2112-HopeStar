package com.example.be.service;

import com.example.be.request.product.ProductConfigRequest;
import com.example.be.response.ProductConfigResponse;

public interface ProductConfigService {
    ProductConfigResponse create(ProductConfigRequest productConfigRequest) throws Exception;
}
