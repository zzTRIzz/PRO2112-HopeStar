package com.example.be.core.client.cart.service;

import com.example.be.core.client.cart.dto.request.OrderRequest;
import com.example.be.entity.Account;

public interface OrderService {

    Object order(OrderRequest orderRequest, Account account) throws Exception;

}
