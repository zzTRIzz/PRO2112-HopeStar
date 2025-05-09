package com.example.be.core.client.cart.dto.response.DanhGiaResponse;

import com.example.be.core.client.cart.dto.response.DanhGiaResponse.ProductReviewsResponse;
import lombok.Data;

import java.util.List;

@Data
public class ProductReviewsListResponse {
    private List<ProductReviewsResponse> reviews;
    private RatingSummaryResponse ratingSummaryResponse;
    private boolean hasPurchased;
    private Integer numberSold;
    private Integer evaluate;
    private String product;

}
