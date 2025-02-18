package com.example.be.controller.admin.account.dto.response;

import com.example.be.entity.Account;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * DTO for {@link Account}
 */


@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
    Integer id;
    @Size(max = 255)
    String fullName;
    @Size(max = 255)
    String code;
    @Size(max = 255)
    String email;
    @Size(max = 256)
    String password;
    @Size(max = 255)
    String phone;
    @Size(max = 255)
    String address;
    @Size(max = 1000)
    String googleId;
    @Size(max = 255)
    String imageAvatar;
    RoleResponse idRole;
    Boolean gender;
    String status;
}