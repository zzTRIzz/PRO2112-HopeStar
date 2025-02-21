package com.example.be.core.admin.banhang.service;

import com.example.be.core.admin.banhang.dto.ShoppingCartDto;
import com.example.be.entity.ShoppingCart;

import java.util.List;

public interface ShoppingCartService {
    List<ShoppingCart> getAllGioHang();

//    List<ShoppingCart> getByIDShoppingCart(Integer idAccount);

    List<ShoppingCartDto> getAllGHShoppingCart();

    List<ShoppingCartDto> getAllGioHangEntity();


    List<ShoppingCartDto> getByIDShoppingCart(Integer idAccount);

    ShoppingCartDto CreateGioHang(ShoppingCartDto shoppingCartDto);
}
