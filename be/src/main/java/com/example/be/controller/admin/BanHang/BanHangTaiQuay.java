package com.example.be.controller.admin.BanHang;

import com.example.be.service.ProductDetailService;
import com.example.be.service.ProductService;
import com.example.be.service.atribute.product.BillDetailService;
import com.example.be.service.atribute.product.BillService;
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
@RequestMapping("/api/admin/product")
public class BanHangTaiQuay {

    @Autowired
    BillService billService;

    @Autowired
    BillDetailService billDetailService;

    @Autowired
    ProductService productService;

    @Autowired
    ProductDetailService productDetailService;



}
