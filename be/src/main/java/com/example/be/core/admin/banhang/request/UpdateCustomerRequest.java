package com.example.be.core.admin.banhang.request;

import lombok.Data;

@Data
public class UpdateCustomerRequest {

    private Integer id;
    private String name;
    private String phone;
    private String address;
    private String note;

}
