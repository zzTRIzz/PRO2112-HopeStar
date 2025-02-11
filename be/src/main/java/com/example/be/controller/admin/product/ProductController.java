package com.example.be.controller.admin.product;

import com.example.be.dto.ProductDTO;
import com.example.be.entity.Product;
import com.example.be.mapper.ProductMapper;
import com.example.be.request.ProductRequest;
import com.example.be.response.ProductResponse;
import com.example.be.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
