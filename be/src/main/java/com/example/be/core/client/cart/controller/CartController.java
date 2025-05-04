package com.example.be.core.client.cart.controller;

import com.example.be.core.admin.account.dto.response.ResponseData;
import com.example.be.core.admin.voucher.dto.response.VoucherApplyResponse;
import com.example.be.core.admin.voucher.service.VoucherService;
import com.example.be.core.client.auth.service.AuthService;
import com.example.be.core.client.cart.dto.request.AddToCartRequest;
import com.example.be.core.client.cart.dto.request.CartDetailRequest;
import com.example.be.core.client.cart.dto.request.OrderRequest;
import com.example.be.core.client.cart.dto.response.CartResponse;
import com.example.be.core.client.cart.service.CartDetailService;
import com.example.be.core.client.cart.service.CartService;
import com.example.be.core.client.cart.service.OrderService;
import com.example.be.entity.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/client")
public class CartController {

    private final CartService cartService;
    private final AuthService authService;
    private final CartDetailService cartDetailService;
    private final OrderService orderService;
    private final VoucherService voucherService;

    @GetMapping("/cart")
    public ResponseEntity<ResponseData<?>> getCart(@RequestHeader(value = "Authorization") String jwt) throws Exception {

            Account account = authService.findAccountByJwt(jwt);
            CartResponse cartResponse = cartService.getCart(account);
            return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK, "ok", cartResponse));

    }
    @PostMapping("/add-to-cart")
    public ResponseData<?> addToCart(@RequestHeader(value = "Authorization") String jwt,
                                     @RequestBody AddToCartRequest addToCartRequest) throws Exception {

        Account account = authService.findAccountByJwt(jwt);
        Object o = cartService.addToCart(addToCartRequest,account,null);
        return new ResponseData<>(HttpStatus.OK,"ok",o);

    }

    @PutMapping("/cart-detail/update/{itemId}")
    public ResponseData<?> updateCartDetail(@RequestHeader(value = "Authorization") String jwt,
                                            @PathVariable("itemId") Integer id,
                                            @RequestBody CartDetailRequest cartDetailRequest) throws Exception {

        authService.findAccountByJwt(jwt);
        Object o = cartDetailService.updateQuantityCartDetail(id,cartDetailRequest);
        return new ResponseData<>(HttpStatus.ACCEPTED,"ok",o);

    }

    @DeleteMapping("/cart-detail/delete/{itemId}")
    public ResponseData<?> deleteCartDetail(@RequestHeader(value = "Authorization") String jwt,
                                            @PathVariable("itemId") Integer id) throws Exception {

        authService.findAccountByJwt(jwt);
        Object o = cartDetailService.deleteCartDetail(id);
        return new ResponseData<>(HttpStatus.OK,"ok",o);

    }

    @PostMapping("/cart-detail/check-product")
    public ResponseData<?> checkCartDetail(@RequestBody List<Integer> idCartDetailList,
                                           @RequestHeader(value = "Authorization") String jwt) throws Exception {

        authService.findAccountByJwt(jwt);
        Object o = cartDetailService.checkCartDetail(idCartDetailList);
        return new ResponseData<>(HttpStatus.OK,"ok",o);

    }

    @PostMapping("/order")
    public ResponseData<?> order(@RequestHeader(value = "Authorization") String jwt,
                                 @RequestBody OrderRequest orderRequest) throws Exception {


        Account account = authService.findAccountByJwt(jwt);
        Object o = orderService.order(orderRequest,account);
        return new ResponseData<>(HttpStatus.OK,"ok",o);

    }

    @GetMapping("/voucher")
    public ResponseData<List<?>> getVoucher(@RequestHeader(value = "Authorization") String jwt) throws Exception {


        Account account = authService.findAccountByJwt(jwt);
        List<VoucherApplyResponse> list = voucherService.getVoucherApply(account);
        return new ResponseData<>(HttpStatus.OK,"ok",list);

    }

}
