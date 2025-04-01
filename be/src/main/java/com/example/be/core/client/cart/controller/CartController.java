package com.example.be.core.client.cart.controller;

import com.example.be.core.admin.account.dto.response.ResponseData;
import com.example.be.core.client.auth.service.AuthService;
import com.example.be.core.client.cart.dto.response.CartResponse;
import com.example.be.core.client.cart.service.CartService;
import com.example.be.entity.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/client/cart")
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    @GetMapping("")
    public ResponseData<?> getCart(@RequestHeader("Authorization") String jwt) throws Exception {

        Account account = authService.findAccountByJwt(jwt);
        CartResponse cartResponse = cartService.getCart(account);
        return new ResponseData<>(HttpStatus.OK,"ok",cartResponse);

    }

}
