package com.example.be.core.admin.products_management.controller;

import com.example.be.core.admin.atribute_management.service.product_detail.ImeiService;
import com.example.be.core.admin.products_management.model.response.ProductImeiResponse;
import com.example.be.core.admin.products_management.service.ProductDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/product-detail")
public class ProductDetailController {

    private final ProductDetailService productDetailService;
    private final ImeiService imeiService;

    @GetMapping("/{id}/imei")
    public ResponseEntity<List<ProductImeiResponse>> getImeiByProductDetail(@PathVariable Integer id){
        List<ProductImeiResponse> productImeiResponses = imeiService.getImeiByProductDetail(id);
        return ResponseEntity.ok(productImeiResponses);
    }

}
