package com.example.be.service.impl;

import com.example.be.dto.ProductDTO;
import com.example.be.entity.*;
import com.example.be.entity.status.StatusCommon;
import com.example.be.mapper.ProductMapper;
import com.example.be.repository.*;
import com.example.be.request.product.ProductRequest;
import com.example.be.response.ProductResponse;
import com.example.be.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;
    private final ProductRepository productRepository;
    private final FrontCameraRepository frontCameraRepository;
    private final RearCameraRepository rearCameraRepository;
    private final FrontCameraProductRepository frontCameraProductRepository;
    private final RearCameraProductRepository rearCameraProductRepository;
    private final CategoryRepository categoryRepository;
    private final ProductCategoryRepository productCategoryRepository;


    @Override
    public List<ProductResponse> getAll() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(product -> productMapper.dtoToResponse(productMapper.entityToDTO(product)))
                .collect(Collectors.toList());
    }
}
