package com.example.be.core.admin.sale.dto.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SaleDTO {
    private Integer id;
    private String code;
    private String name;
    private LocalDateTime dateStart;
    private LocalDateTime dateEnd;
    private String description;
    private Integer discountValue;
    private Boolean discountType;
}
