package com.example.be.core.admin.atribute_management.dto.request;

import com.example.be.entity.status.StatusImei;
import lombok.Data;

@Data
public class ImeiRequest {
    private String imeiCode;
    private StatusImei status;
}
