package com.example.be.dto;

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
    private String imeiCod;
    private String barCode;
    private StatusImei statusImei;

}
