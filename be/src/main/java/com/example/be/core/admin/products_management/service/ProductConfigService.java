package com.example.be.core.admin.products_management.service;

import com.example.be.core.admin.products_management.model.request.ProductConfigRequest;
import com.example.be.core.admin.products_management.model.response.ProductConfigResponse;

public interface ProductConfigService {
    ProductConfigResponse create(ProductConfigRequest productConfigRequest) throws Exception;
}
