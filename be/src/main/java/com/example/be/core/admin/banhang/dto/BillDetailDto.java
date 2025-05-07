package com.example.be.core.admin.banhang.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BillDetailDto {

    private Integer idBill;

    private Integer idProductDetail;

    private List<Integer> id_Imei;
}
