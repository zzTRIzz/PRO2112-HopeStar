package com.example.be.controller.admin.account.exception;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ErrorResponse {
    private LocalDateTime timestamp;
    private Integer status;
    private String path;
    private String error;
    private String message;
}