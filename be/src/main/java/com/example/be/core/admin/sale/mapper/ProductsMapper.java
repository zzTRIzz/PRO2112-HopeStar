package com.example.be.core.admin.sale.mapper;

import com.example.be.core.admin.sale.dto.response.ProductListResponse;
import com.example.be.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductsMapper {

    public ProductListResponse toListResponse(Product product) {
        ProductListResponse response = new ProductListResponse();
        response.setId(product.getId());
        response.setCode(product.getCode());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        return response;
    }
}