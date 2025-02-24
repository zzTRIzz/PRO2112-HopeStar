package com.example.be.core.client.auth.dto.request;

import lombok.Data;

@Data
public class SignupRequest {
    private String fullName;
    private String email;
    private String password;
    private String otp;
}
