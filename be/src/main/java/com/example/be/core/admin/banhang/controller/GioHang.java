package com.example.be.core.admin.banhang.controller;

import com.example.be.core.admin.banhang.dto.CartDetailDto;
import com.example.be.core.admin.banhang.dto.ShoppingCartDto;
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
    public List<ShoppingCartDto> hienThi(@PathVariable("idAccount")Integer idAccount){
        return shoppingCartService.getByIDShoppingCart(idAccount);
    }

    @GetMapping("/cartDetail/{idGH}")
    public List<CartDetailDto> chiTietGioHang(@PathVariable("idGH")Integer idGH){
        return cartDetailService.getByIdGH(idGH);
    }

    @PostMapping("/addCart")
    public ResponseEntity<ShoppingCartDto> createShoppingCart(@RequestBody ShoppingCartDto shoppingCartDto){
        System.out.println(shoppingCartDto.getIdAccount());
        ShoppingCartDto shoppingCart1 = shoppingCartService.CreateGioHang(shoppingCartDto);
        return ResponseEntity.ok(shoppingCart1);
    }

    @PostMapping("/addCartDetail")
    public ResponseEntity<CartDetailDto> creatCartDetail(@RequestBody CartDetailDto cartDetailDto){
        CartDetailDto saveCartDetailDto = cartDetailService.createGHCT(cartDetailDto);
        return ResponseEntity.ok(saveCartDetailDto);
    }

    @PostMapping("/updateCartDetail")
    public ResponseEntity<CartDetailDto> updateCartDetail(@RequestBody CartDetailDto cartDetailDto){
        CartDetailDto saveCartDetailDto = cartDetailService.createGHCT(cartDetailDto);
        return ResponseEntity.ok(saveCartDetailDto);
    }

}
