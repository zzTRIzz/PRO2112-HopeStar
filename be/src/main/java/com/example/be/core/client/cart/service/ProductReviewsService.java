package com.example.be.core.client.cart.service;

import com.example.be.core.client.cart.dto.request.ProductReviewsRequest;
import com.example.be.core.client.cart.dto.response.DanhGiaResponse.ProductReviewsListResponse;
import com.example.be.core.client.cart.dto.response.DanhGiaResponse.ProductReviewsResponse;
import com.example.be.entity.Account;

public interface ProductReviewsService {


    ProductReviewsListResponse findByIdProduct(Integer idProduct, Account account);

    ProductReviewsResponse submitReview(ProductReviewsRequest request, Account account);
}
