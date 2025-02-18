package com.example.be.core.admin.products_management.service;

import com.example.be.core.admin.products_management.model.request.SearchProductDetailRequest;
import com.example.be.core.admin.products_management.model.response.ProductDetailResponse;
import org.springframework.data.domain.Page;

public interface ProductDetailService {
    Page<ProductDetailResponse> searchProductDetails(SearchProductDetailRequest searchProductDetailRequest, int page, int size, Integer id);
}
