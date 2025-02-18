package com.example.be.service;

import com.example.be.dto.request.products.ProductConfigRequest;
import com.example.be.dto.response.products.ProductConfigResponse;

public interface ProductConfigService {
    ProductConfigResponse create(ProductConfigRequest productConfigRequest) throws Exception;
}
