package com.example.be.core.admin.banhang.dto;

import com.example.be.entity.ProductDetail;
import com.example.be.entity.status.StatusImei;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ImeiDto {

    private Integer id;

    private String imeiCode;

    private String barCode;

    private StatusImei status;

    private Integer productDetail;
}


