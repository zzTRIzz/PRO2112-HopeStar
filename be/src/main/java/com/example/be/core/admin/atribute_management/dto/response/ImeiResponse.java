package com.example.be.core.admin.atribute_management.dto.response;

import com.example.be.entity.status.StatusImei;
import lombok.Data;

@Data
public class ImeiResponse {

    private Integer id;
    private String productName;
    private String imeiCode;
    private String barCode;
    private StatusImei status;

}
