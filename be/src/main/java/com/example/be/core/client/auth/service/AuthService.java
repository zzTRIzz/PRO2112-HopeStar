package com.example.be.core.client.auth.service;

import com.example.be.core.client.auth.dto.request.LoginRequest;
import com.example.be.core.client.auth.dto.response.AccountResponse;
import com.example.be.core.client.auth.dto.response.AuthResponse;
import com.example.be.core.client.auth.dto.request.SignupRequest;
import com.example.be.entity.Account;

public interface AuthService {
    Object sentOtp(String email) throws Exception;
    String createUser(SignupRequest signupRequest) throws Exception;
    AuthResponse signing(LoginRequest loginRequest) throws Exception;
    AccountResponse getAccountProfile(String jwt) throws Exception;
    Account findAccountByJwt(String jwt) throws Exception;
    Object forgotPassword(String email) throws Exception;
    Object resetPassword(String token, String newPassword) throws Exception;
}
