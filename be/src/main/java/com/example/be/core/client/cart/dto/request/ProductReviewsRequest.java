package com.example.be.core.client.cart.dto.request;

import com.example.be.entity.Account;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductReviewsRequest {
    private Integer productDetailId;
    private Integer generalRating;
    private String comment;
    private List<String> imageUrls;
}
