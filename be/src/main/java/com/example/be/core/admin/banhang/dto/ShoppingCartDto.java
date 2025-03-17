package com.example.be.core.admin.banhang.dto;

import com.example.be.entity.Account;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ShoppingCartDto {

    private Integer id;

    private Integer idAccount;

    private String code;

    private String status;
}
