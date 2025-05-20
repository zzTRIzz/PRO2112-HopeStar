package com.example.be.core.admin.products_management.controller;

import com.example.be.core.admin.account.dto.response.ResponseData;
import com.example.be.core.admin.account.dto.response.ResponseError;
import com.example.be.core.admin.products_management.mapper.ProductMapper;
import com.example.be.core.admin.products_management.dto.request.ProductConfigRequest;
import com.example.be.core.admin.products_management.dto.request.ProductRequest;
import com.example.be.core.admin.products_management.dto.request.SearchProductDetailRequest;
import com.example.be.core.admin.products_management.dto.request.SearchProductRequest;
import com.example.be.core.admin.products_management.dto.response.ProductConfigResponse;
import com.example.be.core.admin.products_management.dto.response.ProductDetailResponse;
import com.example.be.core.admin.products_management.dto.response.ProductResponse;
import com.example.be.core.admin.products_management.service.ProductConfigService;
import com.example.be.core.admin.products_management.service.ProductDetailService;
import com.example.be.core.admin.products_management.service.ProductService;
import com.example.be.core.client.auth.service.AuthService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
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
    private final AuthService authService;

    @GetMapping("")
    public ResponseEntity<List<ProductResponse>> getAll(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        List<ProductResponse> responses = productService.getAll();
        return ResponseEntity.ok(responses);

    }
    @GetMapping("search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @ModelAttribute SearchProductRequest searchRequest) {

        List<ProductResponse> result = productService.searchProducts(searchRequest);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseData<ProductResponse> getProductById(@PathVariable Integer id) {
        try {
            ProductResponse productResponse = productMapper.dtoToResponse(productMapper.entityToDTO(productService.getProductById(id)));
            return new ResponseData<>(HttpStatus.OK,"display successful",productResponse);
        }catch (Exception e){
            return new ResponseError(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
    // product vs product-detail
    @PostMapping("/create-product")
    public ResponseData<ProductConfigResponse> add(@RequestBody ProductConfigRequest productConfigRequest,
                                                   @RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        ProductConfigResponse productConfigResponse = productConfigService.create(productConfigRequest);
        return new ResponseData<>(HttpStatus.CREATED,"create product successfully",productConfigResponse);
    }

    @PutMapping("/{id}")
    public ResponseData<?> update(@PathVariable Integer id,
                                  @RequestBody ProductRequest productRequest,
                                  @RequestHeader(value = "Authorization") String jwt) throws Exception {

        authService.findAccountByJwt(jwt);
        productService.update(productRequest,id);
        return new ResponseData<>(HttpStatus.ACCEPTED,"update product successfully");
    }

    @PatchMapping("/{id}")
    public ResponseData<?> updateStatus(@PathVariable Integer id,
                                        @RequestHeader(value = "Authorization") String jwt) throws Exception {

        authService.findAccountByJwt(jwt);
        try {
            productService.updateStatus(id);
            return new ResponseData<>(HttpStatus.ACCEPTED,"update status product successfully");
        }catch (Exception e){
            return new ResponseData<>(HttpStatus.NOT_FOUND,e.getMessage());
        }
    }

    @GetMapping("/{id}/product-detail")
    public ResponseEntity<List<ProductDetailResponse>> searchProductDetails(
            @ModelAttribute SearchProductDetailRequest searchProductDetailRequest,
            @PathVariable Integer id) {

        List<ProductDetailResponse> result = productDetailService.searchProductDetails(searchProductDetailRequest,id);
        return ResponseEntity.ok(result);
    }

}
