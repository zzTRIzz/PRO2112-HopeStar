package com.example.be.core.admin.banhang.controller;

import com.example.be.core.admin.banhang.service.CartDetailService;
import com.example.be.core.admin.banhang.service.ShoppingCartService;
import com.example.be.entity.CartDetail;
import com.example.be.entity.ShoppingCart;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.ProductDetailRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@RequestMapping("/api/admin/giohang")
public class GioHang {

    @Autowired
    ShoppingCartService shoppingCartService;

    @Autowired
    CartDetailService cartDetailService;

    @Autowired
    ProductDetailRepository productDetailRepository;

    @Autowired
    AccountRepository accountRepository;


    @GetMapping("/shoppingCart")
    public List<ShoppingCart> hienThi(){
        return shoppingCartService.getAllGioHang();
    }

    @GetMapping("/shoppingCart/{idAccount}")
    public List<ShoppingCart> hienThi(@PathVariable("idAccount")Integer idAccount){
        return shoppingCartService.getByIDShoppingCart(idAccount);
    }

    @GetMapping("/cartDetail/{idGH}")
    public List<CartDetail> chiTietGioHang(@PathVariable("idGH")Integer idGH){
        return cartDetailService.getByIdGH(idGH);
    }


    @PostMapping
    public ResponseEntity<ShoppingCart> createShoppingCart(ShoppingCart shoppingCart){
        ShoppingCart shoppingCart1 = shoppingCartService.CreateGioHang(shoppingCart);
        return ResponseEntity.ok(shoppingCart1);
    }

    @PostMapping("/addCartDetail")
    public ResponseEntity<CartDetail> creatCartDetail(CartDetail cartDetail){
        CartDetail saveCartDetail = cartDetailService.createGHCT(cartDetail);
        return ResponseEntity.ok(saveCartDetail);
    }

    @PostMapping("/updateCartDetail")
    public ResponseEntity<CartDetail> updateCartDetail(CartDetail cartDetail){
        CartDetail saveCartDetail = cartDetailService.createGHCT(cartDetail);
        return ResponseEntity.ok(saveCartDetail);
    }

}
