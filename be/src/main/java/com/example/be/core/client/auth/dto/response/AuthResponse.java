package com.example.be.core.client.auth.dto.response;

import lombok.Data;

@Data
public class AuthResponse {
    private String jwt;
    private String message;
    private String role;
}
