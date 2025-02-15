package com.example.be.controller.admin.product;

import com.example.be.request.product.ProductRequest;
import com.example.be.response.ProductResponse;
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

}
