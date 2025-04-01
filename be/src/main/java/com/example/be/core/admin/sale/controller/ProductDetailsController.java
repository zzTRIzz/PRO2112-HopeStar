package com.example.be.core.admin.sale.controller;

import com.example.be.core.admin.sale.dto.response.ProductDetailsResponse;
import com.example.be.core.admin.sale.mapper.ProductDetailsMapper;
import com.example.be.entity.ProductDetail;
import com.example.be.repository.ProductDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/product-details")
@RequiredArgsConstructor
public class ProductDetailsController {
    private final ProductDetailRepository productDetailRepository;
    private final ProductDetailsMapper productDetailMapper;

    @GetMapping
    public ResponseEntity<List<ProductDetailsResponse>> getAllProductDetails() {
        List<ProductDetail> productDetails = productDetailRepository.findAll();
        List<ProductDetailsResponse> responses = productDetails.stream()
                .map(productDetailMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
    // Lấy spct theo id của sản phẩm
    @GetMapping("/by-product/{productId}")
    public ResponseEntity<List<ProductDetailsResponse>> getDetailsByProductId(@PathVariable Integer productId) {
        List<ProductDetail> productDetails = productDetailRepository.findByProductId(productId);
        List<ProductDetailsResponse> responses = productDetails.stream()
                .map(productDetailMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}
