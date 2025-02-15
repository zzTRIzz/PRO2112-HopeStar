package com.example.be.controller.admin.product;

import com.example.be.request.product.ProductConfigRequest;
import com.example.be.request.product.ProductRequest;
import com.example.be.response.ProductConfigResponse;
import com.example.be.response.ProductResponse;
import com.example.be.service.ProductConfigService;
import com.example.be.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/product")
public class ProductController {

    private final ProductService productService;
    private final ProductConfigService productConfigService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll(){

        List<ProductResponse> responses = productService.getAll();
        return ResponseEntity.ok(responses);

    }
    @PostMapping
    public ResponseEntity<ProductResponse> add(@RequestBody ProductRequest productRequest) throws Exception {

        ProductResponse response = productService.add(productRequest);
        return ResponseEntity.ok(response);

    }
    @PostMapping("/create-product")
    public ResponseEntity<ProductConfigResponse> add(@RequestBody ProductConfigRequest productConfigRequest) throws Exception {
        ProductConfigResponse productConfigResponse = productConfigService.create(productConfigRequest);
        return ResponseEntity.ok(productConfigResponse);
    }

}
