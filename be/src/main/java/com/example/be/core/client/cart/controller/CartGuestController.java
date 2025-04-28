package com.example.be.core.client.cart.controller;

import com.example.be.core.admin.account.dto.response.ResponseData;
import com.example.be.core.admin.voucher.dto.response.VoucherApplyResponse;
import com.example.be.core.admin.voucher.service.VoucherService;
import com.example.be.core.client.cart.dto.request.AddToCartRequest;
import com.example.be.core.client.cart.dto.request.CartDetailRequest;
import com.example.be.core.client.cart.dto.request.OrderRequest;
import com.example.be.core.client.cart.dto.response.CartResponse;
import com.example.be.core.client.cart.service.CartDetailService;
import com.example.be.core.client.cart.service.CartService;
import com.example.be.core.client.cart.service.OrderService;
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
@RequestMapping("/guest")
public class CartGuestController {

    private final CartService cartService;
    private final CartDetailService cartDetailService;
    private final OrderService orderService;
    private final VoucherService voucherService;

    @GetMapping("/cart")
    public ResponseEntity<ResponseData<?>> getCart(@CookieValue(value = "guest_cart_id", required = false) String guestCartId) throws Exception {
        String cartId = guestCartId != null ? guestCartId : UUID.randomUUID().toString();
        CartResponse cartResponse = cartService.getOrCreateGuestCart(cartId);

        // Trả về cookie nếu là lần đầu
        if (guestCartId == null) {
            ResponseCookie cookie = ResponseCookie.from("guest_cart_id", cartId)
                    .httpOnly(true)
                    .secure(false)
                    .maxAge(29 * 24 * 60 * 60) // 29 ngày
                    .path("/")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new ResponseData<>(HttpStatus.OK, "ok", cartResponse));
        }

        return ResponseEntity.ok(new ResponseData<>(HttpStatus.OK, "ok", cartResponse));


    }
    @PostMapping("/add-to-cart")
    public ResponseData<?> addToCart(@RequestBody AddToCartRequest addToCartRequest,
                                     @CookieValue(value = "guest_cart_id", required = false)String guestCartId) throws Exception {
        Object o = cartService.addToCart(addToCartRequest,null,guestCartId);
        return new ResponseData<>(HttpStatus.OK,"ok",o);

    }

    @PutMapping("/cart-detail/update/{itemId}")
    public ResponseData<?> updateCartDetail(@PathVariable("itemId") Integer id,
                                            @RequestBody CartDetailRequest cartDetailRequest) throws Exception {

        Object o = cartDetailService.updateQuantityCartDetail(id,cartDetailRequest);
        return new ResponseData<>(HttpStatus.ACCEPTED,"ok",o);

    }

    @DeleteMapping("/cart-detail/delete/{itemId}")
    public ResponseData<?> deleteCartDetail(@PathVariable("itemId") Integer id) throws Exception {

        Object o = cartDetailService.deleteCartDetail(id);
        return new ResponseData<>(HttpStatus.OK,"ok",o);

    }

    @PostMapping("/cart-detail/check-product")
    public ResponseData<?> checkCartDetail(@RequestBody List<Integer> idCartDetailList) throws Exception {

        Object o = cartDetailService.checkCartDetail(idCartDetailList);
        return new ResponseData<>(HttpStatus.OK,"ok",o);

    }

    @PostMapping("/order")
    public ResponseData<?> order(@RequestBody OrderRequest orderRequest) throws Exception {

        Object o = orderService.order(orderRequest,null);
        return new ResponseData<>(HttpStatus.OK,"ok",o);

    }

    @GetMapping("/voucher")
    public ResponseData<List<?>> getVoucher() {

        List<VoucherApplyResponse> list = voucherService.getVoucherApply(null);
        return new ResponseData<>(HttpStatus.OK,"ok",list);

    }


}
