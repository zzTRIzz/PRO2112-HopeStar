package com.example.be.core.client.cart.service;

import com.example.be.core.client.cart.dto.request.AddToCartRequest;
import com.example.be.core.client.cart.dto.response.CartResponse;
import com.example.be.entity.Account;

public interface CartService {
    CartResponse getCart(Account account);
    Object addToCart(AddToCartRequest request, Account account) throws Exception;
}
