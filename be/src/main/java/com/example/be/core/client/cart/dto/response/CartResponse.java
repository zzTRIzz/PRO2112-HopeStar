package com.example.be.core.client.cart.dto.response;

import lombok.Data;


import java.util.List;

@Data
public class CartResponse {

    private Integer quantityCartDetail;
    private List<CartDetailResponse> cartDetailResponseList;

}
