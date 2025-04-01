package com.example.be.core.client.cart.dto.request;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Integer idProductDetail;
    private Integer quantity;
}
