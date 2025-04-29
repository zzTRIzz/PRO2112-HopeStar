package com.example.be.core.admin.sale.service.impl;

import com.example.be.core.admin.sale.dto.response.ProductListResponse;
import com.example.be.core.admin.sale.mapper.ProductsMapper;
import com.example.be.core.admin.sale.service.ProductsService;
import com.example.be.entity.Product;
import com.example.be.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductsServiceImpl implements ProductsService {

    private final ProductRepository productRepository;
    private final ProductsMapper productsMapper;

    @Override
    public List<ProductListResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productsMapper::toListResponse)
                .toList();
    }
}