package com.example.be.core.admin.sale.service;

import com.example.be.core.admin.sale.dto.response.ProductListResponse;
import java.util.List;

public interface ProductsService {
    List<ProductListResponse> getAllProducts();
}