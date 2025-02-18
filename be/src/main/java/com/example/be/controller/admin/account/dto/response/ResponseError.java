package com.example.be.controller.admin.account.dto.response;

import org.springframework.http.HttpStatus;

public class ResponseError extends ResponseData{
    public ResponseError(HttpStatus status, String message) {
        super(status, message);
    }
}