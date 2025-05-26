package com.example.be.core.client.cart.service;

import com.example.be.core.client.cart.dto.request.CartDetailRequest;
import com.example.be.core.client.cart.dto.request.CheckCartRequest;

import java.util.List;

public interface CartDetailService {

    Object deleteCartDetail(Integer idCartDetail) throws Exception;

    Object updateQuantityCartDetail(Integer idCartDetail, CartDetailRequest cartDetailRequest) throws Exception;

    Object checkCartDetail(CheckCartRequest checkCartRequest) throws Exception;

}
