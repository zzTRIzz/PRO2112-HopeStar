package com.example.be.core.client.auth.controller;

import com.example.be.core.client.auth.dto.request.LoginRequest;
import com.example.be.core.client.auth.dto.request.OtpRequest;
import com.example.be.core.client.auth.dto.request.SignupRequest;
import com.example.be.core.client.auth.dto.response.AuthResponse;
import com.example.be.core.client.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/sign-up")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody SignupRequest signupRequest) throws Exception {
        String jwt = authService.createUser(signupRequest);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Register success");
        return ResponseEntity.ok(authResponse);
    }
    @PostMapping("/sent-otp")
    public ResponseEntity<String> sentOtpHandler(@RequestBody OtpRequest otpRequest) throws Exception {

        authService.sentLoginOtp(otpRequest.getEmail());

        return ResponseEntity.ok("Otp sent successfully");
    }

    @PostMapping("/signing")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest req) throws Exception {
        AuthResponse authResponse = authService.signing(req);
        return ResponseEntity.ok(authResponse);
    }

}
