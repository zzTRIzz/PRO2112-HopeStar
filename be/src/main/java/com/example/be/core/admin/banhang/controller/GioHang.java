package com.example.be.core.admin.banhang.controller;

import com.example.be.core.admin.banhang.dto.*;
import com.example.be.core.admin.banhang.service.BillService;
import com.example.be.core.admin.banhang.service.CartDetailService;
import com.example.be.core.admin.banhang.service.ImeiSoldService;
import com.example.be.core.admin.banhang.service.ShoppingCartService;
import com.example.be.entity.Account;
import com.example.be.entity.Bill;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.BillRepository;
import com.example.be.repository.ProductDetailRepository;
import com.example.be.repository.ShoppingCartRepository;
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
    ImeiSoldService imeiSoldService;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    ShoppingCartRepository shoppingCartRepository;

    @Autowired
    BillRepository billRepository;

    @Autowired
    CartDetailService cartDetailService;

    @Autowired
    ProductDetailRepository productDetailRepository;


    @GetMapping
    public List<ShoppingCartDto> hienThiShoppingCart(){
        return shoppingCartService.getAllGHShoppingCart();
    }

    @GetMapping("/shoppingCart/{idAccount}")
    public List<ShoppingCartDto> hienThi(@PathVariable("idAccount")Integer idAccount){
        return shoppingCartService.getByIDShoppingCart(idAccount);
    }

    @GetMapping("/cartDetail/{idGH}")
    public List<CartDetailDto> chiTietGioHang(@PathVariable("idGH")Integer idGH){
        return cartDetailService.getByIdGH(idGH);
    }

    @GetMapping("/deleteCartDetail/{idCartDetail}")
    public String deleteCartDetail(@PathVariable("idCartDetail")Integer idCartDetail){
       cartDetailService.deleteCartDetail(idCartDetail);
       return "Delete Thanh Cong";
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

    @PostMapping("/updateStatus")
    public ResponseEntity<?> updateStatus(@RequestBody CartDetaillStatusDto cartDetaillStatus){
//        System.out.println("idAcounnt là gì " + cartDetaillStatus.getIdAccount());
        CartDetailDto saveCartDetailDto = cartDetailService.thayDoiTrangThai(cartDetaillStatus.getIdCart(),
                cartDetaillStatus.getIdProductDetail());
        return ResponseEntity.ok(saveCartDetailDto);
    }

    @PostMapping("/muaHangOnline")
    public ResponseEntity<?> muaHangOnline(@RequestParam Integer idCart){
        if (idCart == null){
            throw new RuntimeException("Vui long dien idAccount");
        }
        BillDto billDto = cartDetailService.thanhToanGioHang(idCart);
        if (billDto == null){
            throw new RuntimeException("Them that bai!!!!");
        }
        return ResponseEntity.ok(billDto);
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
