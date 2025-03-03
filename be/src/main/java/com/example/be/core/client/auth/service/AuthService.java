package com.example.be.core.client.auth.service;

import com.example.be.core.client.auth.dto.request.LoginRequest;
import com.example.be.core.client.auth.dto.response.AuthResponse;
import com.example.be.core.client.auth.dto.request.SignupRequest;

public interface AuthService {
    void sentLoginOtp(String email) throws Exception;
    String createUser(SignupRequest signupRequest) throws Exception;
    AuthResponse signing(LoginRequest loginRequest) throws Exception;
}
