package com.example.be.core.admin.account.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class NhanVienRequest {
    String fullName;
    String code;
    @Size(max = 255)
    @Email(message = "Đang sai định dạng email")
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
    Integer idRole;
    Boolean gender;
    LocalDate birthDate;
    String status;
}
