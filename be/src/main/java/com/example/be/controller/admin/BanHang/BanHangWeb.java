//package com.example.be.controller.admin.BanHang;
//
//import com.example.be.entity.CartDetail;
//import com.example.be.entity.ShoppingCart;
//import com.example.be.repository.AccountRepository;
//import com.example.be.repository.ProductDetailRepository;
//import com.example.be.service.CartDetailService;
//import com.example.be.service.ShoppingCartService;
//import lombok.AllArgsConstructor;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@AllArgsConstructor
//@RequiredArgsConstructor
//@RequestMapping("/api/admin/banhangweb")
//public class BanHangWeb {
//    @Autowired
//    ShoppingCartService shoppingCartService;
//
//    @Autowired
//    CartDetailService cartDetailService;
//
//    @Autowired
//    ProductDetailRepository productDetailRepository;
//
//    @Autowired
//    AccountRepository accountRepository;
//
//
//    @GetMapping
//    public List<ShoppingCart> hienThi(){
//        return shoppingCartService.getAllGioHang();
//    }
//
//
//
//}
