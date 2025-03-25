package com.example.be.core.client.home.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class ProductViewResponseAll {
    private List<ProductViewResponse> newestProducts;
    private List<ProductViewResponse> bestSellingProducts;

}
