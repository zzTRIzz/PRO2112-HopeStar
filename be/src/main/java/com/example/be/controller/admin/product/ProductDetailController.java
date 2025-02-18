package com.example.be.controller.admin.product;


import com.example.be.dto.response.products.ProductImeiResponse;
import com.example.be.service.ProductDetailService;
import com.example.be.service.atribute.product_detail.ImeiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
