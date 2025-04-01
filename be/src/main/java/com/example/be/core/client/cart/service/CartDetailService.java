package com.example.be.core.client.cart.service;

import com.example.be.core.client.cart.dto.request.CartDetailRequest;

public interface CartDetailService {

    Object deleteCartDetail(Integer idCartDetail) throws Exception;

    Object updateQuantityCartDetail(Integer idCartDetail, CartDetailRequest cartDetailRequest) throws Exception;

}
