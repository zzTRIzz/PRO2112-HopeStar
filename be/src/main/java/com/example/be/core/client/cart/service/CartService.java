package com.example.be.core.client.cart.service;

import com.example.be.core.client.cart.dto.response.CartResponse;
import com.example.be.entity.Account;

public interface CartService {
    CartResponse getCart(Account account);
}
