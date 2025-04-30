package com.example.be.core.client.cart.dto.response.DanhGiaResponse;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductReviewsResponse {
    private Integer id;
    private Account account;
    private Integer generalRating;
    private String comment;
    private LocalDateTime dateAssessment;
    private List<String> imageUrls;

//    @Data
//    public static class Products {
//        private String productName;
//    }

    @Data
    public static class Account{
        private String fullName;
        private String avatar;
    }



}
