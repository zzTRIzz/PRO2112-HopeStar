package com.example.be.core.admin.products_management.service;

import com.example.be.core.admin.products_management.dto.request.SearchProductDetailRequest;
import com.example.be.core.admin.products_management.dto.response.ProductDetailResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductDetailService {
    void updateStatus(Integer id) throws Exception;
    List<ProductDetailResponse> searchProductDetails(SearchProductDetailRequest searchProductDetailRequest, Integer id);

    void updateSoLuongProductDetail(Integer idProductDetail, Integer quantity);

    void updateStatusProduct(Integer idProductDetail);

    void updateSoLuongSanPham(Integer idProductDetail, Integer quantity);
}
