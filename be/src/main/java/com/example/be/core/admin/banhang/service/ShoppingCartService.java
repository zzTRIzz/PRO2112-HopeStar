package com.example.be.core.admin.banhang.service;

import com.example.be.entity.ShoppingCart;

import java.util.List;

public interface ShoppingCartService {
    List<ShoppingCart> getAllGioHang();

//    List<ShoppingCart> getByIDShoppingCart(Integer idAccount);

    List<ShoppingCart> getByIDShoppingCart(Integer idAccount);

    ShoppingCart CreateGioHang(ShoppingCart shoppingCart);
}
