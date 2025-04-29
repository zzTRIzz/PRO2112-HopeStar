package com.example.be.core.admin.account.dto.response;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * DTO for {@link com.example.be.entity.Role}
 */
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleResponse {
    Integer id;
    @Size(max = 255)
    String code;
    @Size(max = 255)
    String name;
}