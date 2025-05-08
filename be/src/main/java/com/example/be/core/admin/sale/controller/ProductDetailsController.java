package com.example.be.core.admin.sale.controller;

import com.example.be.core.admin.sale.dto.response.ProductDetailsResponse;
import com.example.be.core.admin.sale.mapper.ProductDetailsMapper;
import com.example.be.core.client.auth.service.AuthService;
import com.example.be.entity.ProductDetail;
import com.example.be.repository.ProductDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/product-details")
@RequiredArgsConstructor
public class ProductDetailsController {
    private final ProductDetailRepository productDetailRepository;
    private final ProductDetailsMapper productDetailMapper;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<ProductDetailsResponse>> getAllProductDetails(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        List<ProductDetail> productDetails = productDetailRepository.findAll();
        List<ProductDetailsResponse> responses = productDetails.stream()
                .map(productDetailMapper::toResponse)
                .collect(Collectors.toList());
        authService.findAccountByJwt(jwt);
        return ResponseEntity.ok(responses);
    }
    // Lấy spct theo id của sản phẩm
    @GetMapping("/by-product/{productId}")
    public ResponseEntity<List<ProductDetailsResponse>> getDetailsByProductId(@PathVariable Integer productId,@RequestHeader(value = "Authorization") String jwt) throws Exception {
        List<ProductDetail> productDetails = productDetailRepository.findByProductId(productId);
        List<ProductDetailsResponse> responses = productDetails.stream()
                .map(productDetailMapper::toResponse)
                .collect(Collectors.toList());
        authService.findAccountByJwt(jwt);
        return ResponseEntity.ok(responses);
    }


}
