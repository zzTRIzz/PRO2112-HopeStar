package com.example.be.core.admin.products_management.controller;

import com.example.be.core.admin.account.dto.response.ResponseData;
import com.example.be.core.admin.atribute_management.service.product_detail.ImeiService;
import com.example.be.core.admin.products_management.dto.response.ProductImeiResponse;
import com.example.be.core.admin.products_management.service.ProductDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
        List<ProductImeiResponse> productImeiRespons1s = imeiService.getImeiByProductDetail(id);
        return ResponseEntity.ok(productImeiRespons1s);
    }
    @PatchMapping("/{id}")
    public ResponseData<?> updateStatus(@PathVariable Integer id){

        try {
            productDetailService.updateStatus(id);
            return new ResponseData<>(HttpStatus.ACCEPTED,"update status product-detail successfully");
        }catch (Exception e){
            return new ResponseData<>(HttpStatus.NOT_FOUND,e.getMessage());
        }

    }

}
