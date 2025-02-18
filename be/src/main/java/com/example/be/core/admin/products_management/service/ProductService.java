package com.example.be.core.admin.products_management.service;


import com.example.be.core.admin.products_management.model.request.ProductRequest;
import com.example.be.core.admin.products_management.model.request.SearchProductRequest;
import com.example.be.core.admin.products_management.model.response.ProductResponse;
import com.example.be.entity.Product;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAll();
    Product getProductById(Integer id) throws Exception;
    void update(ProductRequest productRequest, Integer id) throws Exception;
    void updateStatus(Integer id) throws Exception;
    Page<ProductResponse> searchProducts(SearchProductRequest searchRequest, int page, int size);
}
