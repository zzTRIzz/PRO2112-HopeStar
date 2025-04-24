package com.example.be.core.client.cart.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductReviewsResponse {

    private Integer productId;
    private Integer accountId;
    private Integer generalRating;
    private String comment;
    private LocalDateTime date_assessment;
    private List<String> imageUrls;


    @Data
    public static class Products {
        private String productName;
    }

    @Data
    public static class Account{
        private String fullName;
    }

}
