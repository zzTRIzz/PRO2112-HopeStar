package com.example.be.service;


import com.example.be.request.product.ProductRequest;
import com.example.be.response.ProductResponse;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAll();
    ProductResponse add(ProductRequest request) throws Exception;
}
