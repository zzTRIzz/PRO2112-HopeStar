package com.example.be.core.admin.products_management.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL) // field null not display
public class ApiResponse <T> {
    private int status;
    private String message;
    private T data;
}
