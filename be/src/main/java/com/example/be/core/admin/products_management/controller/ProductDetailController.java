package com.example.be.core.admin.products_management.controller;

import com.example.be.core.admin.account.dto.response.ResponseData;
import com.example.be.core.admin.atribute_management.service.product_detail.ImeiService;
import com.example.be.core.admin.products_management.dto.request.ProductDetailRequest;
import com.example.be.core.admin.products_management.dto.request.ProductImeiRequest;
import com.example.be.core.admin.products_management.dto.response.ProductImeiResponse;
import com.example.be.core.admin.products_management.service.ProductDetailService;
import com.example.be.core.client.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/product-detail")
public class ProductDetailController {

    private final ProductDetailService productDetailService;
    private final ImeiService imeiService;
    private final AuthService authService;

    @GetMapping("/{id}/imei")
    public ResponseEntity<List<ProductImeiResponse>> getImeiByProductDetail(@PathVariable Integer id,
                                                                            @RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        List<ProductImeiResponse> productImeiRespons1s = imeiService.getImeiByProductDetail(id);
        return ResponseEntity.ok(productImeiRespons1s);
    }
    @PatchMapping("/{id}")
    public ResponseData<?> updateStatus(@PathVariable Integer id,
                                        @RequestHeader(value = "Authorization") String jwt) throws Exception {

        authService.findAccountByJwt(jwt);
        productDetailService.updateStatus(id);
        return new ResponseData<>(HttpStatus.OK,"Cập nhật trạng thái thành công");
    }
    @PutMapping("/{id}")
    public ResponseData<?> updateProductDetail(@PathVariable Integer id,
                                               @RequestBody ProductDetailRequest productDetailRequest,
                                               @RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        productDetailService.updateProductDetail(id,productDetailRequest);
        return new ResponseData<>(HttpStatus.OK,"Cập nhật sản phẩm thành công");

    }
    @PostMapping("/quantity/{id}")
    public ResponseData<?> addImeiProductDetail(@PathVariable Integer id,
                                                @RequestBody List<ProductImeiRequest> imeiRequest,
                                                @RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        productDetailService.addQuantityProductDetail(id, imeiRequest);
        return new ResponseData<>(HttpStatus.ACCEPTED,"add quantity product-detail successfully");

    }

    @PostMapping("/import-excel")
    public ResponseData<?> importExcel(@RequestParam("idProduct") Integer idProduct,
                                       @RequestParam("file") MultipartFile file,
                                       @RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        productDetailService.importFileExcelProductDetail(idProduct,file);
        return new ResponseData<>(HttpStatus.ACCEPTED,"Tải sản phẩm thành công");

    }

}
