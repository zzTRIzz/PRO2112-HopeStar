package com.example.be.core.admin.banhang.controller;

import com.example.be.core.admin.banhang.dto.*;
import com.example.be.core.admin.banhang.service.BillService;
import com.example.be.core.admin.banhang.service.CartDetailService;
import com.example.be.core.admin.banhang.service.ImeiSoldService;
import com.example.be.core.admin.banhang.service.ShoppingCartService;
import com.example.be.entity.Account;
import com.example.be.entity.Bill;
import com.example.be.entity.ShoppingCart;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.BillRepository;
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
@RequestMapping("/api/admin/banhangweb")
public class BanHangWeb {
    @Autowired
    ShoppingCartService shoppingCartService;

    @Autowired
    ImeiSoldService imeiSoldService;

    @Autowired
    BillRepository billRepository;

    @Autowired
    CartDetailService cartDetailService;

    @Autowired
    ProductDetailRepository productDetailRepository;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    BillService billService;

    @PostMapping("/addCart_KTK")
    public ResponseEntity<?> createShoppingCart(){
        ShoppingCart shoppingCart =shoppingCartService.addGioHangKhongTk();
        return ResponseEntity.ok(shoppingCart);
    }
    @PostMapping("/addCartDetail_KTK")
    public ResponseEntity<?> creatCartDetail(@RequestBody CartDetailDto cartDetailDto){
        ShoppingCart shoppingCart = shoppingCartService.addGioHangKhongTk();
        System.out.println(shoppingCart.getId()+"id shopping cart");
        cartDetailDto.setIdShoppingCart(shoppingCart.getId());
        CartDetailDto saveCartDetailDto = cartDetailService.createGHCT(cartDetailDto);
        return ResponseEntity.ok(saveCartDetailDto);
    }

    @PostMapping("/updateStatus")
    public ResponseEntity<?> updateStatus(@RequestBody CartDetaillStatusDto cartDetaillStatus){
//        System.out.println("idAcounnt là gì " + cartDetaillStatus.getIdAccount());
        CartDetailDto saveCartDetailDto = cartDetailService.thayDoiTrangThai(cartDetaillStatus.getIdCart(),
                cartDetaillStatus.getIdProductDetail());
        return ResponseEntity.ok(saveCartDetailDto);
    }

    @PostMapping("/muaHangOnline")
    public ResponseEntity<?> muaHangOnline(@RequestParam Integer idCart){
//        System.out.println("idAcounnt là gì " + idAccount);
        if (idCart == null){
            throw new RuntimeException("Vui long dien idAccount");
        }
        BillDto billDto = cartDetailService.thanhToanGioHangKhongTaiKhoan(idCart);
        if (billDto == null){
            throw new RuntimeException("Them that bai!!!!");
        }

        return ResponseEntity.ok(billDto);
    }

    @PostMapping("/datHang")
    public ResponseEntity<?> datHang(@RequestBody BillDto billDto){
        BillDto savebillDto = billService.createDatHangOnline(billDto);
        if (savebillDto == null){
            throw new RuntimeException("Them that bai!!!!");
        }

        return ResponseEntity.ok(savebillDto);
    }


    @PostMapping("/createImeiSold/{idNhanVien}")
    public ResponseEntity<?> createImeiSold(@RequestBody ImeiSoldDto imeiSoldDto,
                                            @PathVariable("idNhanVien")Integer idNhanVien){
        BillDetailDto billDetailDto = imeiSoldService.creatImeiSold(imeiSoldDto.getIdBillDetail(),
                imeiSoldDto.getId_Imei());

        Account account = accountRepository.findById(idNhanVien).
                orElseThrow(()->new RuntimeException("Khong tim thay nhan vien"));

        Bill bill = billRepository.findById(billDetailDto.getIdBill()).
                orElseThrow(()->new RuntimeException("Khong tim thay hoa don"));
        bill.setIdNhanVien(account);
        billRepository.save(bill);
        return ResponseEntity.ok(billDetailDto);
    }

}
