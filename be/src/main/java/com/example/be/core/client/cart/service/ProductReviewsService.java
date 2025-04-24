package com.example.be.core.client.cart.service;

import com.example.be.core.client.cart.dto.request.ProductReviewsRequest;

public interface ProductReviewsService {
    void submitReview(ProductReviewsRequest request);
}
