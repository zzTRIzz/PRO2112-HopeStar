package com.example.be.core.admin.products_management.dto.model;

import com.example.be.entity.status.StatusImei;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductImeiDTO {

    private Integer id;
    private String imeiCode;
    private String barCode;
    private StatusImei statusImei;

}
