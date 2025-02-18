package com.example.be.service;

import com.example.be.dto.request.products.SearchProductDetailRequest;
import com.example.be.dto.response.products.ProductDetailResponse;
import org.springframework.data.domain.Page;

public interface ProductDetailService {
    Page<ProductDetailResponse> searchProductDetails(SearchProductDetailRequest searchProductDetailRequest, int page, int size,Integer id);
}
