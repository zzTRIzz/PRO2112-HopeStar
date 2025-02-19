package com.example.be.core.admin.banhang.controller;

import com.example.be.core.admin.banhang.service.CartDetailService;
import com.example.be.core.admin.banhang.service.ShoppingCartService;
import com.example.be.entity.ShoppingCart;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.ProductDetailRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@RequestMapping("/api/admin/banhangweb")
public class BanHangWeb {
    @Autowired
    ShoppingCartService shoppingCartService;

    @Autowired
    CartDetailService cartDetailService;

    @Autowired
    ProductDetailRepository productDetailRepository;

    @Autowired
    AccountRepository accountRepository;


    @GetMapping
    public List<ShoppingCart> hienThi(){
        return shoppingCartService.getAllGioHang();
    }


}
