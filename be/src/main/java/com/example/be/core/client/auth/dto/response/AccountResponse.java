package com.example.be.core.client.auth.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AccountResponse {
    private Integer id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String avatar;
    private Integer idRole;
    private Boolean gender;
    private LocalDate birthDate;
}
