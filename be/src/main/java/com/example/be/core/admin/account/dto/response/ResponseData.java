package com.example.be.core.admin.account.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ResponseData<T> {
    private Integer status;
    private String message;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T data;

    /**
     * PUT, PATCH, DELETE
     * */
    public ResponseData(HttpStatus status, String message) {
        this.status = status.value();
        this.message = message;
    }

    /**
     * GET, POST
     * */
    public ResponseData(HttpStatus status, String message, T data) {
        this.status = status.value();
        this.message = message;
        this.data = data;
    }
}
