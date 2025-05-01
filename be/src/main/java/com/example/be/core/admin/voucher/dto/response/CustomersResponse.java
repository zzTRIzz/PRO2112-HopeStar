package com.example.be.core.admin.voucher.dto.response;

import lombok.Data;

@Data
public class CustomersResponse {

    private Integer id;
    private String name;
    private String email;
    private String phone;
    private Integer status; //1 da dung, 2// chua dung, 3//het han, 4//chua ap dung,

}
