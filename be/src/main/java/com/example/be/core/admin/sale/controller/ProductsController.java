package com.example.be.core.admin.sale.controller;

import com.example.be.core.admin.sale.dto.response.ProductListResponse;
import com.example.be.core.admin.sale.service.ProductsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/products")
public class ProductsController {
    private final ProductsService productsService;

    @GetMapping
    public ResponseEntity<List<ProductListResponse>> getAllProducts() {
        return ResponseEntity.ok(productsService.getAllProducts());
    }
}
