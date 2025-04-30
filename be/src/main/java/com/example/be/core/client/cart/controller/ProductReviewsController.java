package com.example.be.core.client.cart.controller;

import com.example.be.core.admin.account.dto.response.ResponseData;
import com.example.be.core.client.auth.service.AuthService;
import com.example.be.core.client.cart.dto.request.ProductReviewsRequest;
import com.example.be.core.client.cart.dto.response.DanhGiaResponse.ProductReviewsListResponse;
import com.example.be.core.client.cart.dto.response.DanhGiaResponse.ProductReviewsResponse;
import com.example.be.core.client.cart.service.ProductReviewsService;
import com.example.be.entity.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/product-reviews")
public class ProductReviewsController {

    @Autowired
    ProductReviewsService productReviewsService;
    @Autowired AuthService authService;

    @GetMapping("/{idProductDetail}")
    public ResponseEntity<ResponseData<?>> getAll(
                @PathVariable("idProductDetail") Integer idProductDetail,
            @RequestHeader(value = "Authorization", required = false) String jwt) throws Exception {
        Account account = null;
        if (jwt != null && !jwt.isEmpty()) {
            account = authService.findAccountByJwt(jwt);
        }

        ProductReviewsListResponse productReviewsResponseList = productReviewsService.findByIdProduct(idProductDetail, account);
        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK, "ok", productReviewsResponseList));
    }


    @PostMapping("/create-product-reviews")
    public ResponseEntity<?> createProductReviews(@RequestBody ProductReviewsRequest request,
                                                  @RequestHeader(value = "Authorization") String jwt)
            throws Exception {
        Account account = authService.findAccountByJwt(jwt);

        ProductReviewsResponse productReviewsResponse = productReviewsService.submitReview(request, account);
        return ResponseEntity.ok(productReviewsResponse);
    }
}
