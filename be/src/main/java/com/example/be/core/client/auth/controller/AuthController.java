package com.example.be.core.client.auth.controller;

import com.example.be.core.admin.products_management.dto.response.ApiResponse;
import com.example.be.core.client.auth.dto.request.LoginRequest;
import com.example.be.core.client.auth.dto.request.OtpRequest;
import com.example.be.core.client.auth.dto.request.SignupRequest;
import com.example.be.core.client.auth.dto.response.AccountResponse;
import com.example.be.core.client.auth.dto.response.AuthResponse;
import com.example.be.core.client.auth.service.AuthService;
import com.example.be.core.client.cart.service.CartService;
import com.example.be.entity.Account;
import com.example.be.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CartService cartService;
    private final AccountRepository accountRepository;

    @PostMapping("/sign-up")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody SignupRequest signupRequest) throws Exception {
        String jwt = authService.createUser(signupRequest);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Register success");
        return ResponseEntity.ok(authResponse);
    }
    @PostMapping("/sent-otp")
    public ResponseEntity<ApiResponse> sentOtpHandler(@RequestBody OtpRequest otpRequest) throws Exception {

        Object o = authService.sentOtp(otpRequest.getEmail());
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setData(o);
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/signing")
    public ResponseEntity<ApiResponse> loginHandler(@RequestBody LoginRequest req,
                                                    @CookieValue(value = "guest_cart_id", required = false) String guestCartId) throws Exception {
        AuthResponse authResponse = authService.signing(req);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setData(authResponse);
        if (guestCartId != null) {
            Account account = accountRepository.findByEmail(req.getEmail());

            // Merge giỏ hàng guest vào tài khoản
            cartService.mergeGuestCartToAccount(guestCartId, account);

            // Xóa cookie guest
            ResponseCookie deleteCookie = ResponseCookie.from("guest_cart_id", "")
                    .maxAge(0)
                    .path("/")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                    .body(apiResponse);
        }
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/profile")
    public ResponseEntity<AccountResponse> getSellerByJwt(@RequestHeader("Authorization") String jwt) throws Exception {
        AccountResponse accountResponse = authService.getAccountProfile(jwt);;
        return new ResponseEntity<>(accountResponse, HttpStatus.OK);

    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody OtpRequest otpRequest) throws Exception {
        Object o = authService.forgotPassword(otpRequest.getEmail());
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setData(o);
        return ResponseEntity.ok(apiResponse);
    }

    // Xử lý đặt lại mật khẩu
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword
    ) throws Exception {

        Object o = authService.resetPassword(token,newPassword);
        return ResponseEntity.ok(o);
    }

}
