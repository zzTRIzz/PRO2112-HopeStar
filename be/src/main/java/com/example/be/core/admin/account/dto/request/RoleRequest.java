package com.example.be.core.admin.account.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;


/**
 * DTO for {@link com.example.be.entity.Role}
 */
@Data
public class RoleRequest {
    Integer id;
    @Size(max = 255)
    String code;
    @Size(max = 255)
    String name;
}