package com.example.be.service;

import com.example.be.entity.ShoppingCart;

import java.util.List;

public interface ShoppingCartService {
    List<ShoppingCart> getAllGioHang();

//    List<ShoppingCart> getByIDShoppingCart(Integer idAccount);

    ShoppingCart CreateGioHang(ShoppingCart shoppingCart);
}
