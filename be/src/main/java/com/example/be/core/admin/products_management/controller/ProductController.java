package com.example.be.core.admin.products_management.controller;

import com.example.be.core.admin.products_management.mapper.ProductMapper;
import com.example.be.core.admin.products_management.model.request.ProductConfigRequest;
import com.example.be.core.admin.products_management.model.request.ProductRequest;
import com.example.be.core.admin.products_management.model.request.SearchProductDetailRequest;
import com.example.be.core.admin.products_management.model.request.SearchProductRequest;
import com.example.be.core.admin.products_management.model.response.ApiResponse;
import com.example.be.core.admin.products_management.model.response.ProductConfigResponse;
import com.example.be.core.admin.products_management.model.response.ProductDetailResponse;
import com.example.be.core.admin.products_management.model.response.ProductResponse;
import com.example.be.core.admin.products_management.service.ProductConfigService;
import com.example.be.core.admin.products_management.service.ProductDetailService;
import com.example.be.core.admin.products_management.service.ProductService;
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
    private final ProductDetailService productDetailService;
    private final ProductMapper productMapper;

    //    @GetMapping
//    public ResponseEntity<List<ProductResponse>> getAll(){
//
//        List<ProductResponse> responses = productService.getAll();
//        return ResponseEntity.ok(responses);
//
//    }
    @GetMapping("")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @ModelAttribute SearchProductRequest searchRequest,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<ProductResponse> result = productService.searchProducts(searchRequest, page, size).getContent();
        return ResponseEntity.ok(result);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Integer id) throws Exception {
        ProductResponse productResponse = productMapper.dtoToResponse(productMapper.entityToDTO(productService.getProductById(id)));
        return ResponseEntity.ok(productResponse);
    }
    // product vs product-detail
    @PostMapping("/create-product")
    public ResponseEntity<ProductConfigResponse> add(@RequestBody ProductConfigRequest productConfigRequest) throws Exception {
        ProductConfigResponse productConfigResponse = productConfigService.create(productConfigRequest);
        return ResponseEntity.ok(productConfigResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Integer id,
                                              @RequestBody ProductRequest productRequest) throws Exception {
        productService.update(productRequest,id);
        ApiResponse response = new ApiResponse();
        response.setMessage("update product successfully");
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse> updateStatus(@PathVariable Integer id) throws Exception {
        productService.updateStatus(id);
        ApiResponse response = new ApiResponse();
        response.setMessage("update status product successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/product-detail")
    public ResponseEntity<List<ProductDetailResponse>> searchProductDetails(
            @ModelAttribute SearchProductDetailRequest searchProductDetailRequest,
            @PathVariable Integer id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<ProductDetailResponse> result = productDetailService.searchProductDetails(searchProductDetailRequest, page, size,id).getContent();
        return ResponseEntity.ok(result);
    }

}
