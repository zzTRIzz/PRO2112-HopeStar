package com.example.be.service;


import com.example.be.dto.request.products.ProductRequest;
import com.example.be.dto.request.products.SearchProductRequest;
import com.example.be.dto.response.products.ProductResponse;
import com.example.be.entity.Product;
import com.example.be.entity.status.StatusCommon;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAll();
    Product getProductById(Integer id) throws Exception;
    void update(ProductRequest productRequest,Integer id) throws Exception;
    void updateStatus(Integer id) throws Exception;
    Page<ProductResponse> searchProducts(SearchProductRequest searchRequest, int page, int size);
}
